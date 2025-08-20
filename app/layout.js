import "./globals.css";

export const metadata = {
  title: 'SaaS Inmobiliarias (Demo)',
}


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
