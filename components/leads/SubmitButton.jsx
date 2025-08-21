// components/leads/SubmitButton.jsx
'use client'
import { useFormStatus } from 'react-dom'

export default function SubmitButton({ children = 'Crear lead' }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
      {pending ? 'Creando...' : children}
    </button>
  )
}
