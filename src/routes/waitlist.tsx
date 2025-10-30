import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Zap, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const Route = createFileRoute('/waitlist')({ component: WaitlistPage })

function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  // Show configuration error if Supabase is not set up
  if (!isSupabaseConfigured) {
    console.error('Supabase environment variables are not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.')
  }

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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Form */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Branding */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">Mixable</h1>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Powered by Mix • AI-Native Apps
              </p>
            </div>

            {/* Success State */}
            {isSuccess && (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-8 bg-primary/5 rounded-2xl border border-primary/20">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      You're on the list
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We'll notify you as soon as Mixable launches. Get ready to build AI-native apps without code.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting}
                      className="h-14 text-base bg-card border-border"
                      autoFocus
                    />
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="w-full h-14 text-base"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Joining
                      </>
                    ) : (
                      'Join Waitlist'
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Features */}
            {!isSuccess && (
              <div className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Multimodal AI with video, audio, and PDF analysis
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Production-ready cloud infrastructure
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Direct to code, no endless iterations
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Hero */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1]">
                Build AI-Native Apps
                <br />
                <span className="text-primary">From a Prompt</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Launch your AI startup without code. Mix-powered apps with multimodal capabilities, ready in minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
