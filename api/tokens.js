export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60')
  
  try {
    // Fetch from public URL (static file)
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers.host
    const response = await fetch(`${protocol}://${host}/nansen-memecoins.json`)
    const data = await response.json()
    
    // Parse tokens
    const tokens = data.data?.data?.slice(0, 50).map(t => ({
      symbol: t.token_symbol || 'UNKNOWN',
      name: t.token_name || '',
      price: parseFloat(t.price_usd || 0),
      volume: parseFloat(t.volume || 0),
      change: parseFloat((t.price_change || 0) * 100),
      marketCap: parseFloat(t.market_cap_usd || 0),
      age: t.token_age_days || 0
    })) || []
    
    res.status(200).json({ 
      tokens, 
      updatedAt: new Date().toISOString(),
      source: 'Nansen AI',
      count: tokens.length
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
}
