import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Zap, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/waitlist')({ component: WaitlistPage })

function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const emailLower = email.toLowerCase().trim()

      // Insert into Supabase
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: emailLower,
        })

      if (insertError) {
        // Handle duplicate email
        if (insertError.code === '23505') {
          throw new Error('This email is already on the waitlist')
        }
        throw new Error('Failed to join waitlist. Please try again.')
      }

      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Mixable</h1>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
              No Loops
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Hero Text */}
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Create apps and websites
              <br />
              <span className="text-primary">by chatting with AI</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No agentic loops. No endless iterations. Just direct, fast results.
            </p>
          </div>

          {/* Success State */}
          {isSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                You're on the list!
              </h3>
              <p className="text-muted-foreground">
                We'll notify you as soon as Mixable launches. Get ready for a better way to build.
              </p>
            </div>
          )}

          {/* Waitlist Form */}
          {!isSuccess && (
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="relative">
                <div className="bg-card rounded-2xl shadow-md border border-border p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Join the Waitlist
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to experience building without loops. We're launching soon.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        disabled={isSubmitting}
                        className="text-base h-12"
                        autoFocus
                      />
                      {error && (
                        <p className="text-sm text-destructive mt-2">{error}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !email.trim()}
                      className="w-full h-12 text-base"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Join Waitlist
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'No Loops',
                    description: 'Direct path from idea to code, no endless iterations',
                  },
                  {
                    title: 'Fast Results',
                    description: 'Get your app built in minutes, not hours',
                  },
                  {
                    title: 'AI Powered',
                    description: 'Advanced AI that understands what you want',
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl border border-border p-4 text-center"
                  >
                    <h4 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        Direct to code, skip the loops • Powered by Mix
      </footer>
    </div>
  )
}
