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

  if (!userRole || userRole.role !== "admin") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const { data, error } = await supabase.from("user_roles").select("*, auth.users(email)")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(req: Request) {
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

  const { userId, role, businessId, outletId } = await req.json()

  const { data, error } = await supabase
    .from("user_roles")
    .update({ role, business_id: businessId, outlet_id: outletId })
    .eq("user_id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

