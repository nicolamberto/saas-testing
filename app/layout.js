import "./globals.css";

export const metadata = {
  title: 'SaaS Inmobiliarias (Demo)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }} className="bg-gray-100 text-gray-900 flex justify-center items-center min-h-screen">
        <div className="w-fit bg-indigo-400/20 rounded-[25px] border-2 relative">
          {children}
        </div>
      </body>
    </html>
  )
}
