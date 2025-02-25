import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileContent = buffer.toString()

  // Parse CSV content (assuming simple CSV format)
  const contacts = fileContent.split("\n").map((line) => {
    const [name, phone, email] = line.split(",")
    return { name: name.trim(), phone: phone.trim(), email: email.trim() }
  })

  // Insert contacts into Supabase
  const { data, error } = await supabase.from("contacts").insert(contacts)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Contacts uploaded successfully", count: contacts.length })
}

