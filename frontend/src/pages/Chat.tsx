import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Trash2, Zap } from 'lucide-react'
import { api } from '@/lib/api'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Button, Card, Spinner, SectionHeader } from '@/components/ui'
import type { ChatMessage, UserProfile } from '@/types'

const SUGGESTIONS = [
  'Create a beginner workout for weight loss',
  'What should I eat before working out?',
  'How do I build muscle as a student?',
  'Best exercises I can do in my dorm room',
  'How much protein do I need daily?',
  'How to stay fit during exam season?',
]

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
          isUser ? 'bg-[#6C63FF]/20' : 'bg-[#00FF87]/20'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-[#6C63FF]" />
        ) : (
          <Bot className="w-4 h-4 text-[#00FF87]" />
        )}
      </div>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[#6C63FF]/20 text-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none'
        }`}
      >
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < msg.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('fitai-chat', [])
  const [profile] = useLocalStorage<Partial<UserProfile> | null>('fitai-profile', null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.slice(-10).map(m => ({ role: m.role, content: m.content }))
      const res = await api.chat(text.trim(), history, profile || undefined)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.response,
        timestamp: new Date(),
      }
      setMessages([...newMessages, aiMsg])
    } catch (err) {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Unable to connect to FitAI. Please check your API configuration.',
        timestamp: new Date(),
      }
      setMessages([...newMessages, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">AI Fitness Coach</h1>
          <p className="text-muted-foreground text-sm">Powered by Google Gemini</p>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
            <Trash2 className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#00FF87]/10 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-[#00FF87]" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Ask FitAI Anything</h3>
              <p className="text-muted-foreground text-sm text-center max-w-sm mb-8">
                Your personal AI trainer is ready. Get workout advice, nutrition tips, and motivation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-4 py-3 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-[#00FF87]/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#00FF87]" />
              </div>
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Spinner size="sm" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about workouts, nutrition, recovery..."
              rows={1}
              className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
              style={{ minHeight: '42px' }}
            />
            <Button
              variant="neon"
              size="md"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </Card>
    </div>
  )
}
