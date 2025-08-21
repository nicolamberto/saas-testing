export default function LeadTable({ leads }) {
    if (!leads?.length) return <p>No hay leads todavía.</p>


    const th = { textAlign: 'left', borderBottom: '1px solid #eee', padding: '8px' }
    const td = { borderBottom: '1px solid #f3f3f3', padding: '8px' }


    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={th}>Fecha</th>
                    <th style={th}>Nombre</th>
                    <th style={th}>Email</th>
                    <th style={th}>Teléfono</th>
                    <th style={th}>Origen</th>
                    <th style={th}>Score</th>
                </tr>
            </thead>
            <tbody>
                {leads.map(l => (
                    <tr key={l.id}>
                        <td style={td}>{new Date(l.created_at).toLocaleString()}</td>
                        <td style={td}>{l.full_name}</td>
                        <td style={td}>{l.email ?? '—'}</td>
                        <td style={td}>{l.phone ?? '—'}</td>
                        <td style={td}>{l.source ?? '—'}</td>
                        <td style={td}>{l.score ?? '—'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}