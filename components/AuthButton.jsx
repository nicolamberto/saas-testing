'use client'
import { createClient } from '@/lib/supabaseClient'


export default function AuthButton() {
    const signIn = async () => {
        const supabase = createClient()
        const origin = window.location.origin
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${origin}/auth/callback?next=/dashboard`,
            },
        })
    }


    return (
        <button
            onClick={signIn}
            style={{ padding: '10px 14px', border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer' }}
        >
            Entrar con Google
        </button>
    )
}