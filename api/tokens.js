export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60')
  
  const NANSEN_API_KEY = process.env.NANSEN_API_KEY
  
  try {
    if (NANSEN_API_KEY) {
      const response = await fetch('https://api.bankr.bot/agent/prompt', {
        method: 'POST',
        headers: { 'X-API-Key': NANSEN_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Show top 5 trending memecoins on Base by volume' })
      })
      const data = await response.json()
      return res.status(200).json({ tokens: data.tokens || [], updatedAt: new Date().toISOString(), source: 'Nansen AI' })
    }
    
    const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=base')
    const data = await response.json()
    
    const memecoins = data.pairs?.filter(p => p.chainId === 'base').slice(0, 10).map(p => ({
      symbol: p.baseToken?.symbol || 'UNKNOWN',
      price: parseFloat(p.priceUsd || 0),
      volume: parseFloat(p.volume?.h24 || 0),
      change: parseFloat(p.priceChange?.h24 || 0),
      dexId: p.dexId
    })) || []
    
    res.status(200).json({ tokens: memecoins, updatedAt: new Date().toISOString(), source: 'DexScreener' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' })
  }
}
