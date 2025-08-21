import AuthButton from '@/components/auth/AuthButton'
import { createClient } from '@/lib/supabaseServer'
import Link from 'next/link'


// Server Component: en server sí se hace await del cliente
export default async function HomePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()


  return (
    <main style={{ padding: 24 }} className=' border rounded-[25px] flex flex-col items-center justify-center gap-10'>
      <div className='flex flex-col items-center gap-8 px-10 max-w-[500px]'>
        <h1 className='font-bold text-[35px] text-center'>SaaS Inmobiliarias (Demo)</h1>
        <p className='text-gray-600 text-center'>La forma más simple de gestionar tu inmobiliaria online.
          Centralizá tus contactos, generá y calificá leads de manera automática, y hacé crecer tu negocio con herramientas pensadas para el día a día de las inmobiliarias.</p>
      </div>
      {!session ? <AuthButton /> : <Link href="/dashboard">Ir al dashboard</Link>}
    </main>
  )
}