import Link from 'next/link'


export default function LinkButton({ href, children }) {
    return (
        <Link
            href={href}
            className="bg-indigo-500/60 text-white font-bold uppercase border border-gray-300 rounded-lg px-6 py-3 shadow hover:bg-indigo-400 transition-colors duration-200"
        >
            {children}
        </Link>
    )
}