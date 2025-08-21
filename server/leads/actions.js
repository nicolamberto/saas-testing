// server/leads/actions.js
'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'

export async function createLead(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Asegurá que tu perfil tenga org_id (si no, avisamos y no insertamos)
  const { data: prof, error: perr } = await supabase
    .from('profiles').select('org_id').eq('id', user.id).single()

  if (perr || !prof?.org_id) {
    redirect('/dashboard/leadgenerator?error=' + encodeURIComponent('Tu perfil no tiene organización. Entra al Dashboard y vuelve.'))
  }

  const scoreRaw = formData.get('score')
  const score = Number.isFinite(Number(scoreRaw)) ? Math.max(0, Math.min(100, Number(scoreRaw))) : null

  const payload = {
    full_name: (formData.get('full_name') || '').toString().trim() || 'Sin nombre',
    email: (formData.get('email') || '').toString().trim() || null,
    phone: (formData.get('phone') || '').toString().trim() || null,
    source: (formData.get('source') || 'simulator').toString().trim(),
    score,
    notes: (formData.get('notes') || '').toString().trim() || null,
  }

  const { error: insErr } = await supabase.from('leads').insert(payload)
  if (insErr) {
    console.error('leads INSERT error:', insErr)
    redirect('/dashboard/leadgenerator?error=' + encodeURIComponent('No se pudo crear el lead (RLS/validación).'))
  }

  redirect('/dashboard/leads')
}
