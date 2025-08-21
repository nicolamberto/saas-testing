'use client'

import { createClient } from '@/lib/supabaseClient'


export default function LogoutButton() {
    const signOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/'
    }


    return (
        <button
            onClick={signOut}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }}
        >
            Cerrar sesión
        </button>
    )
}