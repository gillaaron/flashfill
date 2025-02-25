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

  let query = supabase.from("outlets").select("*")

  if (userRole.role === "brand_manager") {
    query = query.eq("business_id", userRole.business_id)
  } else if (userRole.role === "outlet_manager") {
    query = query.eq("id", userRole.outlet_id)
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

  if (!userRole || (userRole.role !== "admin" && userRole.role !== "brand_manager")) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const { business_id, name, address, latitude, longitude, contact_person, contact_number, email } = await req.json()

  if (userRole.role === "brand_manager" && business_id !== userRole.business_id) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("outlets")
    .insert({ business_id, name, address, latitude, longitude, contact_person, contact_number, email })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

