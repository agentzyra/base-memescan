export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60')
  
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=base')
    const data = await response.json()
    
    const memecoins = data.pairs?.filter(p => p.chainId === 'base').slice(0, 10).map(p => ({
      symbol: p.baseToken?.symbol || 'UNKNOWN',
      price: parseFloat(p.priceUsd || 0),
      volume: parseFloat(p.volume?.h24 || 0),
      change: parseFloat(p.priceChange?.h24 || 0)
    })) || []
    
    res.status(200).json({ tokens: memecoins, updatedAt: new Date().toISOString(), source: 'DexScreener' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' })
  }
}
