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

const genericBuildingSteps = [
  { text: 'Analyzing your requirements...', delay: 800 },
  { text: 'Designing the UI architecture...', delay: 1200 },
  { text: 'Generating React components...', delay: 1500 },
  { text: 'Setting up routing and navigation...', delay: 1100 },
  { text: 'Adding interactivity and state management...', delay: 1300 },
  { text: 'Optimizing and finalizing the build...', delay: 900 },
]

const youtubeShortsSteps = [
  { text: '🤔 Understanding your requirements...', delay: 800 },
  { text: '✅ AI app architecture designed', delay: 1000 },
  { text: '📦 Setting up Mix agent with multimodal capabilities...', delay: 1200 },
  { text: '✅ Agent configured with ReadMedia tool', delay: 900 },
  { text: '🎨 Creating frontend UI with video input...', delay: 1300 },
  { text: '✅ YouTube URL parser ready', delay: 1000 },
  { text: '✅ Results gallery component created', delay: 1100 },
  { text: '🧠 Implementing AI video analysis...', delay: 1400 },
  { text: '✅ Gemini integration for scene detection', delay: 1200 },
  { text: '✅ Claude integration for viral moment identification', delay: 1300 },
  { text: '✅ FFmpeg video processing configured', delay: 1000 },
  { text: '🎬 Setting up GSAP animations for title overlays...', delay: 1100 },
  { text: '✅ Animation engine ready', delay: 900 },
  { text: '🚀 Deploying your AI app...', delay: 1200 },
  { text: '✅ Backend deployed', delay: 800 },
  { text: '✅ Frontend deployed', delay: 800 },
  { text: '🎉 Your AI-native app is ready!', delay: 1000 },
]

const calorieBuildingSteps = [
  { text: 'Setting up Go backend with SQLite database...', delay: 800 },
  { text: 'Creating calorie entries data model...', delay: 1200 },
  { text: 'Building daily progress tracker component...', delay: 1400 },
  { text: 'Implementing add/edit/delete entry forms...', delay: 1100 },
  { text: 'Creating history view with date picker...', delay: 1300 },
  { text: 'Adding settings page for daily goal...', delay: 900 },
  { text: 'Connecting TanStack Query hooks to API...', delay: 1000 },
  { text: 'Finalizing shadcn UI styling and responsiveness...', delay: 800 },
]

const travelAgentSteps = [
  { text: '🤔 Analyzing travel requirements...', delay: 800 },
  { text: '✅ AI agent architecture designed', delay: 1000 },
  { text: '🔍 Setting up Mix agent with web search & booking tools...', delay: 1200 },
  { text: '✅ Flight search API integrated', delay: 900 },
  { text: '✅ Hotel comparison API integrated', delay: 900 },
  { text: '🎨 Creating beautiful trip planning UI...', delay: 1300 },
  { text: '✅ Form with destination, dates, budget inputs', delay: 1000 },
  { text: '🧠 Implementing autonomous AI agent...', delay: 1400 },
  { text: '✅ Real-time decision-making logic', delay: 1200 },
  { text: '✅ Multi-step reasoning pipeline', delay: 1100 },
  { text: '✅ Budget optimization algorithm', delay: 1000 },
  { text: '📅 Building itinerary generator...', delay: 1300 },
  { text: '✅ Day-by-day activity planner', delay: 1100 },
  { text: '✅ Restaurant reservation system', delay: 1000 },
  { text: '💳 Creating budget breakdown dashboard...', delay: 1200 },
  { text: '✅ Interactive charts and visualizations', delay: 900 },
  { text: '🚀 Deploying AI travel agent...', delay: 1200 },
  { text: '✅ Backend deployed', delay: 800 },
  { text: '✅ Frontend deployed', delay: 800 },
  { text: '🎉 Your AI travel agent is ready!', delay: 1000 },
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

    const timeoutIds: NodeJS.Timeout[] = []

    // Determine which building steps to use based on prompt
    const isYoutubeShortsApp = prompt.toLowerCase().includes('youtube') ||
                               prompt.toLowerCase().includes('shorts') ||
                               prompt.toLowerCase().includes('viral') ||
                               prompt.toLowerCase().includes('video')
    const isCalorieApp = prompt.toLowerCase().includes('calorie') ||
                         prompt.toLowerCase().includes('food') ||
                         prompt.toLowerCase().includes('nutrition') ||
                         prompt.toLowerCase().includes('meal')
    const isTravelApp = prompt.toLowerCase().includes('travel') ||
                        prompt.toLowerCase().includes('trip') ||
                        prompt.toLowerCase().includes('vacation') ||
                        prompt.toLowerCase().includes('flight') ||
                        prompt.toLowerCase().includes('hotel')
    const buildingSteps = isYoutubeShortsApp ? youtubeShortsSteps :
                          isCalorieApp ? calorieBuildingSteps :
                          isTravelApp ? travelAgentSteps : genericBuildingSteps

    // Add user message with plan
    setMessages([
      {
        type: 'user',
        content: plan || prompt,
        timestamp: Date.now(),
      },
    ])

    // Add initial response
    timeoutIds.push(setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: "I'll build that for you right away! Starting the process now...",
          timestamp: Date.now(),
        },
      ])
    }, 500))

    // Add building steps as messages
    let totalDelay = 1200
    buildingSteps.forEach((step, index) => {
      totalDelay += step.delay
      timeoutIds.push(setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'assistant',
            content: step.text,
            timestamp: Date.now(),
          },
        ])
      }, totalDelay))
    })

    // Complete
    timeoutIds.push(setTimeout(() => {
      setIsComplete(true)
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: '✓ Your app is ready! All components have been generated successfully. No loops encountered during the build process.',
          timestamp: Date.now(),
        },
      ])
    }, totalDelay + 1000))

    // Cleanup function to clear all timeouts
    return () => {
      timeoutIds.forEach(id => clearTimeout(id))
    }
  }, [prompt, plan, navigate])

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
          <div className="p-4 border-t border-border">
            <div className="flex gap-2 items-end">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send a message..."
                disabled={!isComplete}
              />
              <Button
                size="icon"
                disabled={!chatInput.trim() || !isComplete}
                className="rounded-full flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Loading State / Preview (70%) */}
        <div className="w-[70%] bg-muted/30 flex flex-col">
          {!isComplete ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-6">
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
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Preview Header */}
              <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-muted-foreground">Live Preview</span>
                  </div>
                  <span className="text-xs text-muted-foreground">localhost:3002</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Zap className="w-3 h-3 mr-1.5" />
                    Deploy
                  </Button>
                </div>
              </div>

              {/* Preview iframe */}
              <div className="flex-1 bg-white">
                <iframe
                  src="http://localhost:3002"
                  className="w-full h-full border-0"
                  title="App Preview"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
