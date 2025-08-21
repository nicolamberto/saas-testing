// components/leads/LeadForm.jsx  ← SIN "use client"
import SubmitButton from './SubmitButton'

export default function LeadForm({ action }) {
  return (
    <form action={action} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
      <label>
        Nombre completo
        <input name="full_name" required placeholder="Juan Pérez" />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="juan@ejemplo.com" />
      </label>
      <label>
        Teléfono
        <input name="phone" placeholder="+34 600 000 000" />
      </label>
      <label>
        Origen
        <select name="source" defaultValue="simulator">
          <option value="simulator">Simulador</option>
          <option value="organic">Orgánico</option>
          <option value="ads">Ads</option>
          <option value="referral">Referencia</option>
        </select>
      </label>
      <label>
        Score (0–100)
        <input name="score" type="number" min="0" max="100" placeholder="80" />
      </label>
      <label>
        Notas
        <textarea name="notes" rows={3} placeholder="Interesado en 3 ambientes" />
      </label>

      <SubmitButton>Crear lead</SubmitButton>
    </form>
  )
}
