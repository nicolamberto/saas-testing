'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/') // vuelve al home
}

export async function setPlan(nextPlan) {
  const supabase = await createClient()

  // validación básica
  const allowed = ['starter', 'pro']
  const plan = (nextPlan || '').toLowerCase()
  if (!allowed.includes(plan)) return { error: 'Plan inválido' }

  // obtener user
  const { data: { user }, error: uerr } = await supabase.auth.getUser()
  if (uerr || !user) return { error: 'No autenticado' }

  // obtener org_id del perfil
  const { data: prof, error: perr } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  if (perr || !prof?.org_id) return { error: 'Perfil sin organización' }

  // actualizar plan de la org (RLS lo permite por owner_user_id)
  const { error: oerr } = await supabase
    .from('organizations')
    .update({ plan })
    .eq('id', prof.org_id)

  if (oerr) return { error: 'No se pudo actualizar el plan' }
  return { ok: true }
}
