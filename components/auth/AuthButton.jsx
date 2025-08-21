'use client'
import { createClient } from '@/lib/supabaseClient'


// Client Component: en client NO se hace await del cliente.
export default function AuthButton() {
  const signIn = async () => {
    const supabase = createClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${siteUrl}/auth/callback?next=/dashboard` },
    })
  }


  return (
    <button
      onClick={signIn}
      className='bg-indigo-400 cursor-pointer text-white font-bold uppercase border border-gray-300 rounded-lg px-6 py-3 shadow hover:bg-indigo-300 hover:text-black transition-colors duration-200'
    >
      Entrar con Google
    </button>
  )
}