// Server component: use a small client StartButton for navigation
// External dependencies

// Internal dependencies
import StartButton from '@/components/ui/StartButton'

// Constants
const APP_TITLE: string = 'Zoombox Quiz Challenge'
const COMPANY_NAME: string = 'Zoom Box'

export const metadata = {
  title: APP_TITLE,
  description: 'Test your knowledge with Zoombox Quiz Challenge',
}

// Exports
export default function HomePage() {

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-8" role="main" aria-labelledby="main-title">
      <div className="w-full max-w-3xl text-center">
        <div className="mx-auto mb-8 w-100 sm:w-100">
          <img src="/zoombox-logo.png" alt="Zoom Box" className="w-full h-auto object-contain" />
        </div>

        <h1 id="main-title" className="mb-6 text-2xl font-extrabold text-gray-900 sm:text-4xl">
          Welcome to Zoombox Quiz Challenge
        </h1>

        <div className="mx-auto w-56">
          <StartButton
            size="md"
            aria-label="Start the quiz challenge"
            className="w-full rounded-md border border-gray-400 bg-dark-100 text-gray-900 py-3 text-lg shadow-sm hover:brightness-95"
          >
            Get Started
          </StartButton>
        </div>
      </div>
    </main>
  )
}