'use client'
import { createBrowserClient } from '@supabase/ssr'


// Client helper: retorna de forma síncrona.
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
}