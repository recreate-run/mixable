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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Application Builder</span>
          </div>

          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-50 via-cyan-400 to-slate-50 bg-clip-text text-transparent">
            Build Apps with AI
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Describe your app in plain English and watch as Nova generates a fully functional application in minutes.
          </p>

          {/* Input Section */}
          <div className="mt-12 max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the app you want to build... (e.g., 'Build a todo app with user authentication and priority sorting')"
                  className="min-h-[120px] resize-none bg-slate-900/50 border-slate-700 focus:border-cyan-500 text-slate-50 placeholder:text-slate-500"
                  disabled={isSubmitting}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-300"
                    disabled={isSubmitting}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-300"
                    disabled={isSubmitting}
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-300"
                    disabled={isSubmitting}
                  >
                    <AudioWaveform className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-left">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-300"
                    disabled={isSubmitting}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add context
                  </Button>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium"
                  disabled={isSubmitting || !input.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent mr-2" />
                      Starting build...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Start Building
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Feature Pills */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <div className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300">
              <Zap className="w-4 h-4 inline mr-1 text-cyan-400" />
              Real-time Code Generation
            </div>
            <div className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300">
              <Sparkles className="w-4 h-4 inline mr-1 text-cyan-400" />
              AI-Powered Development
            </div>
            <div className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300">
              <ArrowUp className="w-4 h-4 inline mr-1 text-cyan-400" />
              Instant Preview
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8 text-slate-200">
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
                className="text-left p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all"
                disabled={isSubmitting}
              >
                <h3 className="font-medium text-slate-200 mb-1">{example.title}</h3>
                <p className="text-sm text-slate-400">{example.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
