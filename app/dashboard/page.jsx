export const dynamic = 'force-dynamic'
export const revalidate = 0


import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import { getOrCreateProfileAndOrg } from '@/lib/getOrCreateProfileAndOrg'
import PlanSelector from '@/components/dashboard/PlanSelector'
import ServerSignOutForm from '@/components/auth/ServerSignOutForm'
import { signOut } from '@/server/actions'
import LinkButton from '@/components/ui/LinkButton'


export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) redirect('/')


    const { profile, orgName, plan } = await getOrCreateProfileAndOrg(supabase)


    return (
        <main className='px-10 py-20 flex flex-col items-center gap-2'>
            <h1 className='text-[25px] font-semibold text-center'>
                {orgName ? `Bienvenido ${orgName}` : 'Bienvenido'}
            </h1>


            <p style={{ margin: '12px 0' }}>
                Plan actual: <strong>{plan === 'pro' ? 'Pro' : 'Starter'}</strong>
            </p>


            <PlanSelector plan={plan} />

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <LinkButton href="/dashboard/leadgenerator">Generar leads simulados</LinkButton>
                <LinkButton href="/dashboard/leads">Ver leads</LinkButton>
            </div>
            <ServerSignOutForm action={async () => { 'use server'; await signOut() }} />
        </main>
    )
}