import type { IncomingMessage, ServerResponse } from 'node:http'

// Vercel serverless function — keeps ANTHROPIC_API_KEY server-side only.
// Called by src/lib/claude.ts in production via POST /api/recommendation.
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }))
    return
  }

  // Read raw body from the stream
  const body = await new Promise<string>((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body,
  })

  const data = await upstream.json()
  res.writeHead(upstream.status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}
