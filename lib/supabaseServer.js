import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          // En Server Components, cookies() es read-only y esto lanzará.
          // En Server Actions / Route Handlers es mutable -> funciona.
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // ignorar en contextos read-only
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options, expires: new Date(0) })
          } catch {
            // ignorar en contextos read-only
          }
        },
      },
    }
  )
}
