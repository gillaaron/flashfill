import { createServerSupabaseClient } from "@/lib/supabase-server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">AI-Powered Outbound Calling Service</h1>
        <div className="flex flex-col space-y-4">
          <Link href="/outlets" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Manage Outlets
          </Link>
          <Link
            href="/appointment-slots"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Appointment Slots
          </Link>
          <Link href="/dashboard" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            View Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}

