'use client'
// Este componente sólo renderiza el <form>; la acción vive en el server.
// Alternativa: usar tu LogoutButton (cliente) — pero con acción de servidor limpias cookies httpOnly también.


export default function ServerSignOutForm({ action }) {
    return (
        <form action={action}>
            <button type="submit" className="bg-red-500/60 text-black font-bold uppercase border border-gray-300 rounded-lg px-6 py-3 shadow hover:bg-red-400 transition-colors duration-200 absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer">
                Cerrar sesión
            </button>
        </form>
    )
}