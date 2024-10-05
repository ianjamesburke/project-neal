import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function LandingPage() {
  const videoUrl = 'https://f002.backblazeb2.com/file/creatomate-c8xg3hsxdu/135adfb6-2cb9-47c1-8908-01a8aaa8cafd.mp4';

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <Link href="/home">
        <Button variant="default" size="lg">
          Enter
        </Button>
      </Link>
    </div>
  )
}
