import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Zap, Sparkles, Send, Plus, Paperclip, Globe, AudioWaveform, ArrowUp, X, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
  beforeLoad: () => {
    // Redirect to waitlist only in production builds
    if (import.meta.env.PROD) {
      throw redirect({ to: '/waitlist' })
    }
  }
})

const genericPlanContent = `# Build Plan

## Overview
I'll create your application with a clean, modern design using React and Tailwind CSS.

## Components to Build

### 1. Layout & Structure
- Set up responsive container
- Configure navigation header
- Add footer section

### 2. Core Features
- Implement main functionality components
- Add interactive elements
- Set up state management

### 3. Styling & Polish
- Apply consistent theme
- Add animations and transitions
- Ensure mobile responsiveness

### 4. Final Touches
- Optimize performance
- Add loading states
- Test all interactions

## Technologies
- React 19
- TanStack Router
- Tailwind CSS v4
- shadcn/ui components

## Estimated Build Time
This will take approximately 3-5 minutes to complete.`

const youtubeShortssPlanContent = `# Build Plan: AI YouTube Shorts Generator

## Overview
I'll create an AI-powered application that converts YouTube videos into viral-worthy short-form content. Users paste a YouTube URL, and the AI analyzes the video to create 3 optimized shorts with title animations, captions, and trending styles.

## Core Features to Build

### 1. Video Input Interface
- Clean, minimal home page design
- YouTube URL input field with validation
- Real-time URL parsing and preview
- Submit button with loading states
- Error handling for invalid URLs

### 2. AI Video Analysis Engine
- **ReadMedia Tool**: Extract video content using Gemini Vision
- **Scene Detection**: Identify key moments and transitions
- **Viral Moment Detection**: Use Claude to analyze engagement potential
- **Audio Analysis**: Transcribe speech and identify soundbites
- **Emotional Analysis**: Detect high-energy or emotional moments

### 3. Shorts Generation
- Extract 3 optimal clips (15-30 seconds each)
- **Short #1**: Attention-grabbing hook moment
- **Short #2**: Value/insight delivery
- **Short #3**: Call-to-action or payoff
- Automatic clip trimming and optimization

### 4. Title Animation & Styling
- **GSAP Animations**: Dynamic title overlays
- Trending text styles (bold, colorful, animated)
- Auto-generated captions with perfect timing
- Music/sound suggestions for each clip
- Thumbnail generation with key frames

### 5. Results Gallery
- Grid display of 3 generated shorts
- Video preview for each short
- Download buttons (MP4 format)
- Share to social media options
- Regenerate individual shorts option

## AI Capabilities Powered by Mix

### Multi-Model Routing
- **Gemini**: Video analysis and scene detection
- **Claude**: Viral moment identification and script writing
- **GSAP**: Animation generation for overlays

### Multimodal Processing
- Video frame analysis
- Audio transcription and analysis
- Visual scene understanding
- Text overlay generation

### Real-Time Streaming
- Progress updates during video analysis
- Live preview of detected moments
- Streaming generation status

## Technical Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Video Player**: React Player

### Backend (Mix Integration)
- **AI Agent**: Mix multimodal agent
- **Video Processing**: FFmpeg integration
- **Storage**: Temporary file storage
- **API**: RESTful endpoints

### AI Tools Used
- ReadMedia (video + audio analysis)
- Python Execution (video editing with FFmpeg)
- Web Search (trending music and styles)
- GSAP (title animations)

## Implementation Steps

### Phase 1: Frontend UI (20 minutes)
1. Create modern landing page with gradient backgrounds
2. Build YouTube URL input with validation
3. Add loading animations and progress indicators
4. Design results gallery grid layout
5. Implement video preview components

### Phase 2: Mix Agent Integration (30 minutes)
1. Set up Mix session creation
2. Configure ReadMedia tool for video analysis
3. Implement streaming progress updates
4. Add error handling and retries
5. Connect to Mix backend API

### Phase 3: AI Analysis Pipeline (45 minutes)
1. Send video to Gemini for scene detection
2. Extract audio transcription
3. Use Claude to identify viral moments
4. Score and rank potential short clips
5. Select top 3 clips based on AI scoring

### Phase 4: Shorts Generation (40 minutes)
1. Extract video clips using FFmpeg
2. Generate title animations with GSAP
3. Add auto-captions with perfect timing
4. Create thumbnails from key frames
5. Suggest trending music for each clip

### Phase 5: Results Display (15 minutes)
1. Display 3 generated shorts in grid
2. Add video preview with controls
3. Implement download functionality
4. Add share to TikTok/YouTube buttons
5. Polish loading states and animations

## Estimated Build Time
**Total: ~2.5 hours**

This is a production-ready AI-native app that showcases Mix's multimodal capabilities and demonstrates the future of content creation tools.`

const caloriePlanContent = `# Build Plan: Calorie Tracking App

## Overview
I'll create a comprehensive calorie tracking application with React, TanStack Start, and a Go backend. Users can log meals, track their daily intake, view history, and set personalized goals.

## Core Features to Build

### 1. Daily Calorie Dashboard
- Real-time progress bar showing calories consumed vs. daily goal
- Today's date and total calories display
- Visual progress indicator with color coding
- Quick-add button for new entries

### 2. Food Entry Management
- Add new food entries with name and calorie count
- Edit existing entries
- Delete entries with confirmation
- Timestamp tracking for each entry
- Entry cards showing food name, calories, and time

### 3. History View
- Calendar-style date picker
- View entries from any past date
- Daily summaries with total calories
- Searchable entry history
- Date range filtering

### 4. Settings & Goals
- Set daily calorie goal
- Customize calorie targets
- Anonymous authentication with localStorage
- User preferences persistence

### 5. Backend API (Go)
- RESTful API endpoints for CRUD operations
- SQLite database with migrations
- JSON-based user data storage
- Authentication middleware
- CORS configuration for local development

## Technical Stack

### Frontend
- **Framework**: TanStack Start (React 19)
- **Routing**: TanStack Router
- **State**: TanStack Query for server state
- **UI**: shadcn/ui components
- **Styling**: Tailwind CSS v4

### Backend
- **Language**: Go (net/http)
- **Database**: SQLite with goose migrations
- **Query Builder**: sqlc for type-safe queries
- **Auth**: Anonymous sessions via localStorage

## Implementation Steps

### Phase 1: Backend Setup (30 minutes)
1. Initialize Go project structure
2. Set up SQLite database with goose migrations
3. Create users table with app_data JSON column
4. Implement CRUD endpoints for entries
5. Add settings endpoint for daily goal
6. Configure CORS for localhost:3000

### Phase 2: Frontend Foundation (45 minutes)
1. Set up TanStack Start project
2. Configure TanStack Router with routes
3. Install shadcn/ui components
4. Set up TanStack Query client
5. Implement API client with fetchWithAuth

### Phase 3: Core Features (1 hour)
1. Build DailyProgress component with progress bar
2. Create EntryForm dialog for add/edit
3. Implement EntryList with cards
4. Build EntryCard with edit/delete actions
5. Add AddEntryButton component

### Phase 4: History & Settings (30 minutes)
1. Build history page with date picker
2. Add date range filtering
3. Create settings form for daily goal
4. Implement anonymous auth flow

### Phase 5: Polish & Testing (15 minutes)
1. Add loading states
2. Implement error handling with toasts
3. Add empty states
4. Test all CRUD operations
5. Verify mobile responsiveness

## Estimated Build Time
**Total: ~2.5 hours**

This is a production-ready calorie tracking app with full CRUD functionality, history tracking, and goal management.`

function LandingPage() {
  const [input, setInput] = useState('')
  const [showPlan, setShowPlan] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const navigate = useNavigate()

  // Determine which plan to show based on input
  const isYoutubeShortsApp = input.toLowerCase().includes('youtube') ||
                             input.toLowerCase().includes('shorts') ||
                             input.toLowerCase().includes('viral') ||
                             input.toLowerCase().includes('video')
  const isCalorieApp = input.toLowerCase().includes('calorie') ||
                       input.toLowerCase().includes('food') ||
                       input.toLowerCase().includes('nutrition') ||
                       input.toLowerCase().includes('meal')
  const planContent = isYoutubeShortsApp ? youtubeShortssPlanContent :
                      isCalorieApp ? caloriePlanContent : genericPlanContent

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setIsGeneratingPlan(true)
      // Wait 2 seconds then show the plan
      setTimeout(() => {
        setIsGeneratingPlan(false)
        setShowPlan(true)
      }, 2000)
    }
  }

  const handleApprovePlan = () => {
    navigate({ to: '/build', search: { prompt: input, plan: planContent } })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">Nova</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl space-y-8">
          {/* Hero Text */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Powered by Mix
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Build AI-Native Apps
              <br />
              <span className="text-primary">From a Single Prompt</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {/* The world is changing. Start your AI startup without code. Mix-powered apps with multimodal capabilities, ready in minutes. */}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Multi-model routing</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Production-ready</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>No agentic loops</span>
              </div>
            </div>
          </div>

          {/* Input Card - Exact Lovable Style */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-card rounded-3xl shadow-md border border-border/50 p-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask, search, or make anything..."
                className="min-h-[80px] border-0 focus-visible:ring-0 resize-none p-0 text-base bg-transparent placeholder:text-muted-foreground mb-3"
                autoFocus
                disabled={isGeneratingPlan || showPlan}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    disabled={isGeneratingPlan || showPlan}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted disabled:opacity-50"
                    disabled={isGeneratingPlan || showPlan}
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>Attach</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted disabled:opacity-50"
                    disabled={isGeneratingPlan || showPlan}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Public</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    disabled={isGeneratingPlan || showPlan}
                  >
                    <AudioWaveform className="w-4 h-4" />
                  </button>
                  <Button
                    type="submit"
                    disabled={!input.trim() || isGeneratingPlan || showPlan}
                    size="icon"
                    className="rounded-full h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isGeneratingPlan && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Generating plan...</p>
                </div>
              </div>
            )}
          </form>

          {/* Plan Modal */}
          {showPlan && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <div className="bg-card rounded-2xl shadow-2xl border border-border max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Build Plan Ready</h3>
                      <p className="text-sm text-muted-foreground">Review and approve to start building</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPlan(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Plan Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose prose-sm max-w-none">
                    {planContent.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={i} className="text-2xl font-bold text-foreground mb-4">{line.slice(2)}</h1>
                      } else if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-xl font-semibold text-foreground mt-6 mb-3">{line.slice(3)}</h2>
                      } else if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-lg font-medium text-foreground mt-4 mb-2">{line.slice(4)}</h3>
                      } else if (line.startsWith('- ')) {
                        return <li key={i} className="text-muted-foreground ml-4 mb-1">{line.slice(2)}</li>
                      } else if (line.trim() === '') {
                        return <br key={i} />
                      } else {
                        return <p key={i} className="text-muted-foreground mb-2">{line}</p>
                      }
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-6 border-t border-border bg-muted/30">
                  <Button
                    variant="outline"
                    onClick={() => setShowPlan(false)}
                    className="flex-1"
                  >
                    Modify Prompt
                  </Button>
                  <Button
                    onClick={handleApprovePlan}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve & Build
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Example Prompts */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'YouTube shorts generator',
              'Calorie tracker app',
              'Todo app with dark mode',
              'Analytics dashboard',
            ].map((example) => (
              <button
                key={example}
                onClick={() => setInput(example)}
                className="text-sm px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
                disabled={isGeneratingPlan || showPlan}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        Build AI-Native Apps • Powered by Mix • No Loops, Just Results
      </footer>
    </div>
  )
}
