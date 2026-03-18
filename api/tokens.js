export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60')
  
  const NANSEN_API_KEY = process.env.NANSEN_API_KEY
  
  try {
    if (NANSEN_API_KEY) {
      // Call Nansen API directly
      const response = await fetch('https://api.bankr.bot/agent/prompt', {
        method: 'POST',
        headers: { 
          'X-API-Key': NANSEN_API_KEY, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          prompt: 'research token screener --chain base --sort volume:desc --limit 10 --json' 
        })
      })
      
      const text = await response.text()
      
      // Try to parse JSON from response
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        // If not JSON, parse from text output
        data = { raw: text }
      }
      
      return res.status(200).json({ 
        tokens: data.tokens || data.data?.data || [], 
        raw: text,
        updatedAt: new Date().toISOString(),
        source: 'Nansen AI'
      })
    }
    
    throw new Error('No API key')
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      updatedAt: new Date().toISOString() 
    })
  }
}
