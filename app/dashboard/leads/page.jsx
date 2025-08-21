export const dynamic = 'force-dynamic'
export const revalidate = 0


import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import LinkButton from '@/components/ui/LinkButton'
import LeadTable from '@/components/leads/LeadTable'


export default async function LeadsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/')


    const { data: prof } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single()


    if (!prof?.org_id) redirect('/dashboard')


    const { data: leads = [] } = await supabase
        .from('leads')
        .select('id, full_name, email, phone, source, score, created_at')
        .eq('org_id', prof.org_id)
        .order('created_at', { ascending: false })


    return (

        <main style={{ padding: 24 }} className=''>
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>Leads</h1>


            <div style={{ display: 'flex', gap: 8, margin: '12px 0 20px' }}>
                <LinkButton href="/dashboard">Volver al dashboard</LinkButton>
                <LinkButton href="/dashboard/leadgenerator">Generar leads simulados</LinkButton>
            </div>


            <LeadTable leads={leads} />
        </main>
        
    )
}