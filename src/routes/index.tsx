import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useState, FormEvent } from 'react'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Zap, Sparkles, Send, Plus, Paperclip, Globe, AudioWaveform, ArrowUp } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export const Route = createFileRoute('/')({
  component: LandingPage,
  beforeLoad: () => {
    // Redirect to waitlist only in production builds
    if (import.meta.env.PROD) {
      throw redirect({ to: '/waitlist' })
    }
  }
})

function LandingPage() {
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!input.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Call backend API
      const result = await apiClient.createBuild(input.trim())

      // Navigate to build page with projectId
      navigate({
        to: '/build',
        search: {
          projectId: result.projectId,
          prompt: input.trim()
        }
      })
    } catch (err) {
      console.error('Failed to start build:', err)
      setError(err instanceof Error ? err.message : 'Failed to start build. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Application Builder</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Build Apps with AI
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Describe your app in plain English and watch as Nova generates a fully functional application in minutes.
            </p>
          </div>

          {/* Input Section */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the app you want to build... (e.g., 'Build a todo app with user authentication and priority sorting')"
                  className="min-h-[140px] pr-40"
                  disabled={isSubmitting}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                  >
                    <AudioWaveform className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-destructive text-sm px-1">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4" />
                  Add context
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !input.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      Starting build...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Start Building
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Feature Pills */}
          <div className="mt-14 flex flex-wrap justify-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Real-time Code Generation
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              AI-Powered Development
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground">
              <ArrowUp className="w-3.5 h-3.5 text-primary" />
              Instant Preview
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-foreground">
            Try these examples
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Todo App",
                description: "Task management with priority sorting and due dates",
                prompt: "Build a todo app with user authentication, priority sorting, and due dates"
              },
              {
                title: "Blog Platform",
                description: "Content management system with markdown support",
                prompt: "Build a blog platform with markdown editor, tags, and comments"
              },
              {
                title: "Dashboard",
                description: "Analytics dashboard with charts and real-time data",
                prompt: "Build an analytics dashboard with charts, tables, and real-time updates"
              }
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setInput(example.prompt)}
                className="group text-left p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                disabled={isSubmitting}
              >
                <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">{example.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{example.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
