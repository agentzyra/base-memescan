import { readFileSync } from 'fs'
import { join } from 'path'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60')
  
  try {
    // Read JSON file
    const filePath = join(process.cwd(), 'data', 'nansen-memecoins.json')
    const fileContents = readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
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
