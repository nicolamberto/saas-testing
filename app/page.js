import AuthButton from '@/components/AuthButton'
import { createClient } from '@/lib/supabaseServer'
import Link from 'next/link'


export default async function HomePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()


  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>SaaS Inmobiliarias (Demo)</h1>
      {!session ? (
        <AuthButton />
      ) : (
        <div>
          <Link href="/dashboard">Ir al dashboard</Link>
        </div>
      )}
    </main>
  )
}