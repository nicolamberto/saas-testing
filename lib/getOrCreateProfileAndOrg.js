// lib/getOrCreateProfileAndOrg.js
// Utilidad de servidor: garantiza que el usuario tenga profile y organización.
// Retorna { profile, orgName, plan } o { redirectTo: '/' } si no hay user

/** @param {import('@supabase/ssr').SupabaseClient} supabase */
export async function getOrCreateProfileAndOrg(supabase) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr || !user) return { redirectTo: '/' }

  // Lee profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('id, org_id, full_name, email')
    .eq('id', user.id)
    .maybeSingle()

  const fullName =
    (user.user_metadata && (user.user_metadata.name || user.user_metadata.full_name)) ||
    (user.email ? user.email.split('@')[0] : 'Sin nombre')

  // Crea profile si falta
  if (!profile) {
    const { data: newProfile, error: pInsErr } = await supabase
      .from('profiles')
      .insert({ id: user.id, email: user.email, full_name: fullName, org_id: null })
      .select()
      .single()
    if (pInsErr) throw pInsErr
    profile = newProfile
  } else if (profile.org_id && typeof profile.org_id !== 'string') {
    await supabase.from('profiles').update({ org_id: null }).eq('id', user.id)
    profile.org_id = null
  }

  // Crea org si falta
  if (!profile.org_id) {
    const orgName = profile.full_name || fullName
    const { data: org, error: oInsErr } = await supabase
      .from('organizations')
      .insert({ name: orgName, owner_user_id: user.id })
      .select('id, name')
      .single()
    if (oInsErr) throw oInsErr

    const { error: pUpdErr } = await supabase
      .from('profiles')
      .update({ org_id: org.id })
      .eq('id', user.id)
    if (pUpdErr) throw pUpdErr

    profile.org_id = org.id
  }

  // Datos de la org
  let orgName = null
  let plan = 'starter'
  if (profile.org_id) {
    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .select('name, plan')
      .eq('id', profile.org_id)
      .single()
    if (!orgErr) {
      orgName = org?.name ?? null
      plan = org?.plan ?? 'starter'
    }
  }

  return { profile, orgName, plan }
}
