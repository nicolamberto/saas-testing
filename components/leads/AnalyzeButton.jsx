// components/leads/AnalyzeButton.jsx (Server Component)
export default function AnalyzeButton({ leadId, action }) {
    return (
        <form action={async () => { 'use server'; await action(leadId) }}>
            <button className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                Analizar con IA
            </button>
        </form>
    )
}
