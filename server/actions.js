'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabaseServer'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function setPlan(nextPlan) {
  const supabase = await createClient()
  const allowed = ['starter', 'pro']
  const plan = (nextPlan || '').toLowerCase()
  if (!allowed.includes(plan)) return { error: 'Plan inválido' }

  const { data: { user }, error: uerr } = await supabase.auth.getUser()
  if (uerr || !user) return { error: 'No autenticado' }

  const { data: prof, error: perr } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  if (perr || !prof?.org_id) return { error: 'Perfil sin organización' }

  const { error: oerr } = await supabase
    .from('organizations')
    .update({ plan })
    .eq('id', prof.org_id)

  if (oerr) return { error: 'No se pudo actualizar el plan' }

  // 🔄 Forzar que el dashboard se re-renderice con los datos nuevos
  revalidatePath('/dashboard')

  // Si prefieres navegación explícita (pantallazo actualizado inmediato), usa redirect:
  // redirect('/dashboard')

  return { ok: true }
}
