'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('')

  useEffect(() => {
    fetch('/api/tokens')
      .then(r => r.json())
      .then(d => { setTokens(d.tokens || []); setSource(d.source || ''); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '2rem', color: '#fff' }}>Loading...</div>

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', background: '#0a0a14', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ fontSize: '2.5rem' }}>🔥 Memecoin Screener</h1>
      <p style={{ color: '#888' }}>Find gems before they pump. Powered by {source || 'DexScreener'}.</p>
      
      {tokens.map((t, i) => (
        <div key={i} style={{ background: '#111', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
          <h3>{t.symbol}</h3>
          <p>Price: ${t.price?.toFixed(6)}</p>
          <p>Volume: ${(t.volume/1e6).toFixed(2)}M</p>
          <p>Change: {t.change?.toFixed(2)}%</p>
        </div>
      ))}
    </main>
  )
}
