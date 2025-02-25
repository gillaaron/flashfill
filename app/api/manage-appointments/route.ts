import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { date, discount } = await req.json()

  if (!date || !discount) {
    return NextResponse.json({ error: "Date and discount are required" }, { status: 400 })
  }

  // Insert appointment slot into Supabase
  const { data, error } = await supabase.from("appointment_slots").insert({ date, discount })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Appointment slot created successfully", data })
}

export async function GET() {
  // Fetch appointment slots from Supabase
  const { data, error } = await supabase.from("appointment_slots").select("*").order("date", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

