import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function ChatWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen]     = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your StayNest travel assistant 🏡✨ Ask me anything about travel destinations, property recommendations, or trip planning!"
    }
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const messagesEndRef           = useRef(null)
  const inputRef                 = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && user) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen, user])

  const sendMessage = async () => {
    if (!user) {
      setError('Please log in to chat with the AI assistant.')
      return
    }
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const { data } = await api.post('/chat', {
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
      })
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error('Chat error:', err)
      if (err.response?.status === 401) {
        setError('Please log in to continue chatting.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm your StayNest travel assistant 🏡✨ Ask me anything about travel destinations, property recommendations, or trip planning!"
    }])
    setError('')
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[380px] animate-fade-in">
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col"
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="bg-brand-500 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
                  🏡
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">StayNest Assistant</p>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                    Powered by Gemini AI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {user && (
                  <button
                    onClick={clearChat}
                    className="text-white/70 hover:text-white transition-colors"
                    title="Clear chat"
                  >
                    🗑️
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50/50 dark:bg-slate-800/50">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-3xl mb-4 border border-brand-100 dark:border-brand-800/40 shadow-sm">
                  🔒
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Login to Use AI Assistant
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 leading-relaxed max-w-[280px]">
                  Please log in or create an account to chat with our travel assistant, get recommendations, and plan your trips.
                </p>
                <div className="flex flex-col w-full gap-2.5 max-w-[260px]">
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate('/login')
                    }}
                    className="w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl text-sm transition-colors shadow-md shadow-brand-500/20"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate('/register')
                    }}
                    className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-200 font-medium rounded-xl text-sm transition-colors"
                  >
                    Create an Account
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5">
                          🏡
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-brand-500 text-white rounded-tr-sm'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100 rounded-tl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Loading dots */}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5">
                        🏡
                      </div>
                      <div className="bg-gray-100 dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm">
                        <div className="flex gap-1 items-center">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="text-xs text-red-500 text-center bg-red-50 dark:bg-red-900/20 rounded-xl px-3 py-2">
                      {error}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions */}
                {messages.length === 1 && (
                  <div className="px-4 pb-3 flex gap-2 flex-wrap shrink-0">
                    {[
                      '🏖️ Beach destinations',
                      '💰 Budget stays under $150',
                      '🌍 Best places to visit',
                      '🏔️ Mountain retreats',
                    ].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion.slice(3))
                          inputRef.current?.focus()
                        }}
                        className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="px-4 pb-4 shrink-0">
                  <div className="flex gap-2 bg-gray-50 dark:bg-slate-700 rounded-2xl px-4 py-2 border border-gray-200 dark:border-slate-600 focus-within:border-brand-400 transition-colors">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about travel..."
                      rows={1}
                      className="flex-1 bg-transparent text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none resize-none"
                      style={{ maxHeight: '80px' }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || loading}
                      className="w-8 h-8 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0 self-end"
                    >
                      <svg className="w-4 h-4 text-white rotate-90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-2">
                    Press Enter to send · Shift+Enter for new line
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-brand-500 hover:bg-brand-600'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </>
  )
}