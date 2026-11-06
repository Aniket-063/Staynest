const SYSTEM_PROMPT = `You are a helpful travel assistant for StayNest, an Airbnb-style property booking platform.

You help users with:
- Travel destination recommendations
- Best time to visit places
- Property/listing suggestions based on their needs
- Local tips and travel advice
- Answering questions about bookings, check-in/check-out policies
- Budget planning for trips

StayNest has listings in categories: Beach, Mountain, City, Countryside, Luxury.
Prices range from $119 to $950 per night.

Keep responses concise, friendly and helpful. Use emojis occasionally to make it engaging.
Always respond in the same language the user writes in (English or Hindi/Hinglish).`

const sleep = ms => new Promise(r => setTimeout(r, ms))

// POST /api/chat
async function chat(req, res) {
  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ message: 'messages are required' })

  const history = messages.slice(-20).map(m => ({
    role:  m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content || '').slice(0, 2000) }],
  }))
  while (history.length && history[0].role !== 'user') history.shift()
  if (!history.length) return res.status(400).json({ message: 'No user message found' })

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents:          history,
    generationConfig:  { temperature: 0.7, maxOutputTokens: 4096 },
  })

    const models = (process.env.GEMINI_MODELS || 'gemini-3.5-flash,gemini-3.1-flash-lite,gemini-3.8-flash')
    .split(',')
    .map(m => m.trim())
    .filter(Boolean)

  let data = null

  outer: for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type':   'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY,
          },
          body,
        }
      )
      const json = await response.json()

      if (response.ok) { data = json; break outer }

      console.error(`Gemini error [${model}, try ${attempt}]:`, response.status, json.error?.message)

      // Sirf busy/temporary errors par dobara try karo, baaki par seedha agle model par
      if (![429, 500, 503].includes(response.status)) break
      await sleep(1000 * attempt)
    }
  }

  if (!data) return res.status(503).json({ message: 'AI is busy right now. Please try again in a moment.' })

  const reply = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('')
  if (!reply) {
    console.error('Gemini empty reply:', JSON.stringify(data).slice(0, 500))
    return res.status(502).json({ message: 'No response from AI' })
  }

  res.json({ reply })
}

module.exports = { chat }