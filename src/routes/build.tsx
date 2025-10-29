import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { Sparkles, Check, Loader2, Zap, User, Code2, FileCode2, Layers, Send } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'

export const Route = createFileRoute('/build')({
  component: BuildPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      prompt: (search.prompt as string) || '',
      plan: (search.plan as string) || '',
    }
  },
})

interface StreamMessage {
  type: 'user' | 'assistant'
  content: string
  timestamp: number
}

const buildingSteps = [
  { text: 'Analyzing your requirements...', delay: 800 },
  { text: 'Designing the UI architecture...', delay: 1200 },
  { text: 'Generating React components...', delay: 1500 },
  { text: 'Setting up routing and navigation...', delay: 1100 },
  { text: 'Adding interactivity and state management...', delay: 1300 },
  { text: 'Optimizing and finalizing the build...', delay: 900 },
]

function BuildPage() {
  const { prompt, plan } = Route.useSearch()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<StreamMessage[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!prompt) {
      navigate({ to: '/' })
      return
    }

    // Add user message with plan
    setMessages([
      {
        type: 'user',
        content: plan || prompt,
        timestamp: Date.now(),
      },
    ])

    // Add initial response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: "I'll build that for you right away! Starting the process now...",
          timestamp: Date.now(),
        },
      ])
    }, 500)

    // Add building steps as messages
    let totalDelay = 1200
    buildingSteps.forEach((step, index) => {
      totalDelay += step.delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'assistant',
            content: step.text,
            timestamp: Date.now(),
          },
        ])
      }, totalDelay)
    })

    // Complete
    setTimeout(() => {
      setIsComplete(true)
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: '✓ Your app is ready! All components have been generated successfully. No loops encountered during the build process.',
          timestamp: Date.now(),
        },
      ])
    }, totalDelay + 1000)
  }, [prompt, navigate])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Mixable</h1>
            {!isComplete && (
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                Building...
              </span>
            )}
            {isComplete && (
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full font-medium">
                ✓ Complete
              </span>
            )}
          </div>
          {isComplete && (
            <Button onClick={() => navigate({ to: '/' })} variant="outline" size="sm">
              New Project
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat Messages (30%) */}
        <div className="w-[30%] flex flex-col border-r border-border">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="message-enter">
                <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border bg-card/30">
            <div className="flex gap-2 items-end">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send a message..."
                className="min-h-[60px] border-0 focus-visible:ring-0 resize-none text-sm bg-muted/50 placeholder:text-muted-foreground"
                disabled={!isComplete}
              />
              <Button
                size="icon"
                disabled={!chatInput.trim() || !isComplete}
                className="rounded-full h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Loading State (70%) */}
        <div className="w-[70%] bg-muted/30 flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-6">
            {!isComplete ? (
              <>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Building your app</h3>
                  <p className="text-sm text-muted-foreground">This won't take long...</p>
                </div>
                <div className="space-y-3 mt-8">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <Code2 className="w-4 h-4" />
                    <span>Generating components</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <Layers className="w-4 h-4" />
                    <span>Setting up architecture</span>
                  </div>
                  <div className="flex items-center gap-3 text-primary text-sm font-medium">
                    <FileCode2 className="w-4 h-4" />
                    <span>No loops detected ✓</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">All done!</h3>
                  <p className="text-sm text-muted-foreground">Your app is ready to deploy</p>
                </div>
                <div className="space-y-2 w-full mt-8">
                  <Button className="w-full" size="lg">
                    <Zap className="w-4 h-4 mr-2" />
                    Deploy Now
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Download Code
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
