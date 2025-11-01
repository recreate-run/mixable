import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { Sparkles, Loader2, User, Code2, AlertCircle } from 'lucide-react'
import { useSSE, type SSEMessage } from '@/hooks/useSSE'
import { apiClient } from '@/lib/api-client'

export const Route = createFileRoute('/build')({
  component: BuildPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      projectId: (search.projectId as string) || '',
      prompt: (search.prompt as string) || '',
    }
  },
})

function BuildPage() {
  const { projectId, prompt } = Route.useSearch()
  const { messages, status, error, isPreviewReady } = useSSE(projectId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Reload iframe when preview becomes ready
  useEffect(() => {
    if (isPreviewReady && iframeRef.current) {
      // Reload the iframe by setting its src
      const currentSrc = iframeRef.current.src
      iframeRef.current.src = currentSrc
    }
  }, [isPreviewReady])

  const previewUrl = projectId ? apiClient.getPreviewUrl(projectId) : null

  return (
    <div className="h-screen bg-background text-foreground flex">
      {/* Left Sidebar - Chat */}
      <div className="w-[32%] border-r border-border flex flex-col bg-card">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              {status === 'connecting' && 'Connecting...'}
              {status === 'connected' && 'Live'}
              {status === 'disconnected' && 'Disconnected'}
              {status === 'error' && 'Error'}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-card-foreground">Building your app</h1>
          <p className="text-sm text-muted-foreground mt-1.5 truncate">{prompt}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Initial user message */}
          <div className="flex gap-3.5 message-enter">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-sm font-medium text-card-foreground">You</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{prompt}</div>
            </div>
          </div>

          {/* SSE Messages */}
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {/* Connection Error */}
          {error && (
            <div className="flex gap-3.5 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}

          {/* Loading indicator when no messages */}
          {messages.length === 0 && status === 'connected' && (
            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-sm font-medium text-card-foreground">Nova</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Initializing...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground text-center">
            Project ID: {projectId}
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Live Preview</h2>
            <div className="flex items-center gap-2">
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Open in new tab →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Preview Iframe */}
        <div className="flex-1 bg-muted/30 relative">
          {previewUrl && (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              title="App Preview"
            />
          )}

          {/* Loading overlay - shown until preview is ready */}
          {!isPreviewReady && (
            <div className="absolute inset-0 bg-background flex items-center justify-center z-10">
              <div className="text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div className="text-foreground font-medium">
                  Building your application...
                </div>
                <div className="text-sm text-muted-foreground">
                  Preview will appear here once ready
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: SSEMessage }) {
  const getIcon = () => {
    switch (message.type) {
      case 'user':
        return <User className="w-4 h-4 text-primary" />
      case 'assistant':
        return <Code2 className="w-4 h-4 text-primary" />
      case 'system':
        return <Sparkles className="w-4 h-4 text-primary" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />
      default:
        return <Code2 className="w-4 h-4 text-primary" />
    }
  }

  const getLabel = () => {
    switch (message.type) {
      case 'user':
        return 'You'
      case 'assistant':
        return 'Nova'
      case 'system':
        return 'System'
      case 'error':
        return 'Error'
      default:
        return 'Nova'
    }
  }

  const getBgColor = () => {
    switch (message.type) {
      case 'error':
        return 'bg-destructive/10'
      case 'system':
        return 'bg-primary/5'
      default:
        return 'bg-muted'
    }
  }

  return (
    <div className="flex gap-3.5 message-enter">
      <div className={`w-8 h-8 rounded-full ${getBgColor()} flex items-center justify-center flex-shrink-0`}>
        {getIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <div className="text-sm font-medium text-card-foreground">{getLabel()}</div>
        <div className={`text-sm leading-relaxed ${message.type === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
