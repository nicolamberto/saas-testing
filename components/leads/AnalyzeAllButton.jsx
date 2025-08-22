// components/leads/AnalyzeAllButton.jsx (Server Component)
export default function AnalyzeAllButton({ action, onlyMissing = true }) {
    return (
        <form action={async () => { 'use server'; await action({ onlyMissing }) }}>
            <button className="bg-indigo-500/60 text-white font-bold uppercase border border-gray-300 rounded-lg px-6 py-3 shadow hover:bg-indigo-400 transition-colors duration-200 cursor-pointer">
                Analizar todos {onlyMissing ? '(faltantes)' : '(todos)'}
            </button>
        </form>
    )
}
