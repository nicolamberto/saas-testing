export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import { setPlan } from './actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1) Usuario validado
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr || !user) redirect('/')

  // 2) Lee profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('id, org_id, full_name, email')
    .eq('id', user.id)
    .maybeSingle()

  const fullName =
    (user.user_metadata && (user.user_metadata.name || user.user_metadata.full_name)) ||
    (user.email ? user.email.split('@')[0] : 'Sin nombre')

  // 3) Si no existe profile, crealo con org_id = null
  if (!profile) {
    const { data: newProfile, error: pInsErr } = await supabase
      .from('profiles')
      .insert({ id: user.id, email: user.email, full_name: fullName, org_id: null })
      .select()
      .single()
    if (pInsErr) { console.error('profiles INSERT:', pInsErr); throw pInsErr }
    profile = newProfile
  } else if (profile.org_id && typeof profile.org_id !== 'string') {
    // por si quedó basura rara, lo normalizamos a null
    await supabase.from('profiles').update({ org_id: null }).eq('id', user.id)
    profile.org_id = null
  }

  // 4) Si el profile no tiene org, crea una y vincula
  if (!profile.org_id) {
    const orgName = profile.full_name || fullName
    // Crea org (requiere que el profile YA exista → evita el 23503)
    const { data: org, error: oInsErr } = await supabase
      .from('organizations')
      .insert({ name: orgName, owner_user_id: user.id })
      .select('id, name')
      .single()
    if (oInsErr) { console.error('organizations INSERT:', oInsErr); throw oInsErr }

    // Vincula el profile a la org
    const { error: pUpdErr } = await supabase
      .from('profiles')
      .update({ org_id: org.id })
      .eq('id', user.id)
    if (pUpdErr) { console.error('profiles UPDATE org_id:', pUpdErr); throw pUpdErr }

    profile.org_id = org.id
  }

  // 5) Trae el nombre y el plan (consulta directa por ID)
  let orgName = null
  let plan = 'starter'
  if (profile.org_id) {
    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .select('name, plan')
      .eq('id', profile.org_id)
      .single()
    if (orgErr) console.error('organizations SELECT name/plan:', orgErr)
    orgName = org?.name ?? null
    plan = org?.plan ?? 'starter'
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>
        {orgName ? `Bienvenido ${orgName}` : 'Bienvenido'}
      </h1>

      {/* --- Bloque de "simular pasarela" (cambio de plan) --- */}
      <p style={{ margin: '12px 0' }}>
        Plan actual: <strong>{plan === 'pro' ? 'Pro' : 'Starter'}</strong>
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <form action={async () => { 'use server'; await setPlan('starter') }}>
          <button
            type="submit"
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 6,
              background: plan === 'starter' ? '#eef' : '#fff',
              cursor: 'pointer'
            }}
          >
            Elegir Starter{plan === 'starter' ? ' ✓' : ''}
          </button>
        </form>

        <form action={async () => { 'use server'; await setPlan('pro') }}>
          <button
            type="submit"
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 6,
              background: plan === 'pro' ? '#eef' : '#fff',
              cursor: 'pointer'
            }}
          >
            Elegir Pro{plan === 'pro' ? ' ✓' : ''}
          </button>
        </form>
      </div>
      {/* --- fin bloque plan --- */}

      <form action={async () => {
        'use server'
        const s = await createClient()
        await s.auth.signOut()
        redirect('/')
      }}>
        <button type="submit" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}>
          Cerrar sesión
        </button>
      </form>
    </main>
  )
}
