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
  const { messages, status, error } = useSSE(projectId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const previewUrl = projectId ? apiClient.getPreviewUrl(projectId) : null

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex">
      {/* Left Sidebar - Chat */}
      <div className="w-[30%] border-r border-slate-800 flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-400">
              {status === 'connecting' && 'Connecting...'}
              {status === 'connected' && 'Live'}
              {status === 'disconnected' && 'Disconnected'}
              {status === 'error' && 'Error'}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-slate-200">Building your app</h1>
          <p className="text-sm text-slate-400 mt-1 truncate">{prompt}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Initial user message */}
          <div className="flex gap-3 animate-slideInFromLeft">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-300 mb-1">You</div>
              <div className="text-sm text-slate-400">{prompt}</div>
            </div>
          </div>

          {/* SSE Messages */}
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {/* Connection Error */}
          {error && (
            <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="text-sm text-red-300">{error}</div>
            </div>
          )}

          {/* Loading indicator when no messages */}
          {messages.length === 0 && status === 'connected' && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Code2 className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-300 mb-1">Nova</div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Initializing...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <div className="text-xs text-slate-500 text-center">
            Project ID: {projectId}
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">Live Preview</h2>
            <div className="flex items-center gap-2">
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Open in new tab →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Preview Iframe */}
        <div className="flex-1 bg-slate-900 relative">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              title="App Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
                <div className="text-slate-400">
                  Building your application...
                </div>
                <div className="text-sm text-slate-500">
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
        return <User className="w-4 h-4 text-cyan-400" />
      case 'assistant':
        return <Code2 className="w-4 h-4 text-cyan-400" />
      case 'system':
        return <Sparkles className="w-4 h-4 text-cyan-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Code2 className="w-4 h-4 text-cyan-400" />
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
        return 'bg-red-500/10 border-red-500/20'
      case 'system':
        return 'bg-cyan-500/10 border-cyan-500/20'
      default:
        return 'bg-slate-800'
    }
  }

  return (
    <div className="flex gap-3 animate-slideInFromLeft">
      <div className={`w-8 h-8 rounded-full ${getBgColor()} flex items-center justify-center flex-shrink-0`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-300 mb-1">{getLabel()}</div>
        <div className={`text-sm ${message.type === 'error' ? 'text-red-300' : 'text-slate-400'}`}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
