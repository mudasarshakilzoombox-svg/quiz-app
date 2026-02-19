import StartButton from '@/components/ui/StartButton'

const APP_TITLE: string = 'Zoombox Quiz Challenge'
const COMPANY_NAME: string = 'Zoom Box'

export const metadata = {
  title: APP_TITLE,
  description: 'Test your knowledge with Zoombox Quiz Challenge',
}

export default function HomePage() {

  return (
    <main className="flex min-h-screen items-center justify-center bg-white" role="main" aria-labelledby="main-title">
      <div className="w-full max-w-3xl text-center">
        <div className="mx-auto mb-8 w-100 lg:w-125 sm:w-100">
          <img src="/zoombox-logo.png" alt="Zoom Box" className="w-full h-auto object-contain" />
        </div>

        <h1 id="main-title" className="mb-6 text-4xl font-bold text-gray-900 sm:text-4xl">
          Welcome to Zoombox Quiz Challenge
        </h1>

        <div className="mx-auto w-56">
          <StartButton
            size="md"
            aria-label="Start the quiz challenge"
            className="text-xl font-[400] px-4 py-2 bg-[#007bff] border border-black rounded-md hover:bg-[#9f9f9f] transition-colors cursor-pointer w-[200px]"
          >
            Get Started
          </StartButton>
        </div>
      </div>
    </main>
  )
}