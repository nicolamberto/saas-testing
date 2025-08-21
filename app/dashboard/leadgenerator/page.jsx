export const dynamic = 'force-dynamic'
export const revalidate = 0

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import LinkButton from '@/components/ui/LinkButton'
import LeadForm from '@/components/leads/LeadForm'
import { createLead } from '@/server/leads/actions'

export default async function LeadGeneratorPage({ searchParams }) {
  const params = await searchParams;                  // 👈 AWAITS searchParams
  const errorMsg = params?.error
    ? decodeURIComponent(params.error)
    : null;

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Generar leads simulados</h1>

      <div style={{ display: 'flex', gap: 8, margin: '12px 0 20px' }}>
        <LinkButton href="/dashboard">Volver al dashboard</LinkButton>
        <LinkButton href="/dashboard/leads">Ver leads</LinkButton>
      </div>

      {errorMsg && (
        <div style={{ padding: 8, border: '1px solid #f5c2c7', background: '#f8d7da', borderRadius: 6, marginBottom: 12 }}>
          {errorMsg}
        </div>
      )}

      <LeadForm action={createLead} />
    </main>
  )
}
