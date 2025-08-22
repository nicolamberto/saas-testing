'use server'

import OpenAI from 'openai'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabaseServer'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ---------- helpers ----------
async function embed(text) {
  const r = await openai.embeddings.create({
    model: 'text-embedding-3-small', // 1536 dims (barato para testing)
    input: text || ''
  })
  return r.data[0].embedding
}

// Respuestas API (nuevo): schema va dentro de text.format
async function segmentLeadJSON(text) {
  const schema = {
    type: 'object',
    properties: {
      segment: { type: 'string', enum: ['caliente', 'templado', 'frio'] },
      ai_score: { type: 'integer', minimum: 0, maximum: 100 },
      tags: { type: 'array', items: { type: 'string' } },
      notes: { type: 'string' }
    },
    required: ['segment', 'ai_score', 'tags', 'notes'],
    additionalProperties: false
  }

  // Usamos Responses API con text.format = json_schema.
  const resp = await openai.responses.create({
    model: 'gpt-4o-mini', 
    input: [
      { role: 'system', content: 'Eres un analista de ventas inmobiliarias.' },
      {
        role: 'user',
        content:
          `Devuelve SOLO JSON válido siguiendo el schema.\n\nLead:\n${text}\n\nReglas:\n- segment: caliente|templado|frio\n- ai_score: 0..100\n- tags: máx 6, cortas\n- notes: 1-2 frases con next-step claro`
      }
    ],
    // Nuevo lugar del formato
    text: {
      format: {
        type: 'json_schema',
        name: 'LeadSegmentation',
        schema,
        strict: true
      }
    }
  })

  // Algunas cuentas/dev versions devuelven helpers distintos. Soportamos ambas.
  // 1) Vía output_text (cuando el SDK lo expone):
  if (resp.output_text) {
    return JSON.parse(resp.output_text)
  }

  // 2) Vía output[].content[].text:
  const content = resp.output?.[0]?.content?.[0]
  if (content?.type === 'output_text' && content.text) {
    return JSON.parse(content.text)
  }

  // 3) Último recurso: stringificar todo para entender si hay cambios de forma
  throw new Error('No pude leer JSON del modelo (formato inesperado).')
}

function leadToText(lead) {
  return [
    `Nombre: ${lead.full_name}`,
    lead.email && `Email: ${lead.email}`,
    lead.phone && `Tel: ${lead.phone}`,
    lead.source && `Origen: ${lead.source}`,
    Number.isFinite(lead.score) && `Score inicial: ${lead.score}`,
    lead.notes && `Notas: ${lead.notes}`
  ].filter(Boolean).join('\n')
}

function leadToEmbedString(lead) {
  return `${lead.full_name}\n${lead.email ?? ''}\n${lead.phone ?? ''}\n${lead.source ?? ''}\n${lead.notes ?? ''}`
}

// ---------- 1) Analizar un lead ----------
export async function analyzeLead(leadId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: lead, error: lerr } = await supabase
    .from('leads')
    .select('id, full_name, email, phone, source, score, notes, org_id')
    .eq('id', leadId)
    .single()
  if (lerr || !lead) return { error: 'Lead no encontrado' }

  try {
    const text = leadToText(lead)
    const ja = await segmentLeadJSON(text)
    const vec = await embed(leadToEmbedString(lead))

    const { error: uerr } = await supabase
      .from('leads')
      .update({
        ai_segment: ja.segment,
        ai_score: ja.ai_score,
        ai_tags: ja.tags,
        ai_notes: ja.notes,
        embedding: vec
      })
      .eq('id', leadId)

    if (uerr) return { error: 'No se pudo actualizar el lead con IA' }
    revalidatePath('/dashboard/leads')
    return { ok: true }
  } catch (e) {
    console.error('analyze lead failed', leadId, e?.message)
    return { error: 'IA: fallo al analizar este lead' }
  }
}

// ---------- 2) Analizar TODOS los leads de la organización ----------
export async function analyzeAllLeads({ onlyMissing = true } = {}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: prof, error: perr } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  if (perr || !prof?.org_id) return { error: 'Perfil sin organización' }

  let query = supabase
    .from('leads')
    .select('id, full_name, email, phone, source, score, notes')
    .eq('org_id', prof.org_id)
    .order('created_at', { ascending: false })

  if (onlyMissing) query = query.is('ai_segment', null)

  const { data: leads = [], error: lerr } = await query
  if (lerr) return { error: 'No se pudieron leer los leads' }
  if (!leads.length) return { ok: true, processed: 0 }

  let processed = 0
  for (const lead of leads) {
    try {
      const text = leadToText(lead)
      const ja = await segmentLeadJSON(text)
      const vec = await embed(leadToEmbedString(lead))

      const { error: uerr } = await supabase
        .from('leads')
        .update({
          ai_segment: ja.segment,
          ai_score: ja.ai_score,
          ai_tags: ja.tags,
          ai_notes: ja.notes,
          embedding: vec
        })
        .eq('id', lead.id)
      if (!uerr) processed++
    } catch (e) {
      console.error('analyze lead failed', lead.id, e?.message)
    }
  }

  revalidatePath('/dashboard/leads')
  return { ok: true, processed }
}
