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

// POST /api/chat
async function chat(req, res) {
  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ message: 'messages are required' })

  // Gemini mein assistant ko "model" kehte hain; aakhri 20 messages, har ek max 2000 chars
  const history = messages.slice(-20).map(m => ({
    role:  m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content || '').slice(0, 2000) }],
  }))

  // Gemini ki conversation "user" se shuru honi chahiye (widget ka greeting hata do)
  while (history.length && history[0].role !== 'user') history.shift()
  if (!history.length) return res.status(400).json({ message: 'No user message found' })

  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash'

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type':   'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents:          history,
        generationConfig:  { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error('Gemini error:', data.error?.message)
    return res.status(502).json({ message: 'AI service error. Please try again.' })
  }

  const reply = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('')
  if (!reply) return res.status(502).json({ message: 'No response from AI' })

  res.json({ reply })
}

module.exports = { chat }