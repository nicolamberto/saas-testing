// components/dashboard/PlanSelector.jsx
// Server Component: usa acciones del servidor via <form action={...}>
import { setPlan } from '@/server/actions'


export default function PlanSelector({ plan }) {
    return (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <form action={async () => { 'use server'; await setPlan('starter') }}>
                <button
                    type="submit"
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        background: plan === 'starter' ? '#eef' : '#fff',
                        cursor: 'pointer'
                    }}
                >
                    Elegir Starter{plan === 'starter' ? ' ✓' : ''}
                </button>
            </form>


            <form action={async () => { 'use server'; await setPlan('pro') }}>
                <button
                    type="submit"
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        background: plan === 'pro' ? '#eef' : '#fff',
                        cursor: 'pointer'
                    }}
                >
                    Elegir Pro{plan === 'pro' ? ' ✓' : ''}
                </button>
            </form>
        </div>
    )
}