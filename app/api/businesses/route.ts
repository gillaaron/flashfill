import { NextResponse } from "next/server"
import { createServerSupabaseClient, getUserRole } from "@/lib/supabase-server"

export async function GET(req: Request) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userRole = await getUserRole(user.id)

  if (!userRole) {
    return NextResponse.json({ error: "User role not found" }, { status: 403 })
  }

  let query = supabase.from("businesses").select("*")

  if (userRole.role === "brand_manager") {
    query = query.eq("id", userRole.business_id)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userRole = await getUserRole(user.id)

  if (!userRole || userRole.role !== "admin") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const { name, registration_number, address, contact_name, contact_number, contact_email } = await req.json()

  const { data, error } = await supabase
    .from("businesses")
    .insert({ name, registration_number, address, contact_name, contact_number, contact_email })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

