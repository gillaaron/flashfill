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

  let query = supabase.from("contacts").select("*")

  if (userRole.role === "brand_manager") {
    query = query.eq("business_id", userRole.business_id)
  } else if (userRole.role === "outlet_manager") {
    query = query.eq("outlet_id", userRole.outlet_id)
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

  if (!userRole) {
    return NextResponse.json({ error: "User role not found" }, { status: 403 })
  }

  const { name, phone, email, business_id, outlet_id } = await req.json()

  const contactData = { name, phone, email }

  if (userRole.role === "admin") {
    contactData["business_id"] = business_id
    contactData["outlet_id"] = outlet_id
  } else if (userRole.role === "brand_manager") {
    contactData["business_id"] = userRole.business_id
    contactData["outlet_id"] = outlet_id
  } else if (userRole.role === "outlet_manager") {
    contactData["business_id"] = userRole.business_id
    contactData["outlet_id"] = userRole.outlet_id
  }

  const { data, error } = await supabase.from("contacts").insert(contactData).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

