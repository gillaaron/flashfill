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

  let query = supabase.from("appointment_slots").select("*, outlets(*)")

  if (userRole.role === "outlet_manager") {
    query = query.eq("outlet_id", userRole.outlet_id)
  } else if (userRole.role === "brand_manager") {
    query = query.eq("outlets.business_id", userRole.business_id)
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

  if (!userRole || (userRole.role !== "outlet_manager" && userRole.role !== "brand_manager")) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const { outlet_id, date, discount } = await req.json()

  if (userRole.role === "outlet_manager" && outlet_id !== userRole.outlet_id) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  if (userRole.role === "brand_manager") {
    const { data: outlet, error: outletError } = await supabase
      .from("outlets")
      .select("business_id")
      .eq("id", outlet_id)
      .single()

    if (outletError || outlet.business_id !== userRole.business_id) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }
  }

  const { data, error } = await supabase.from("appointment_slots").insert({ outlet_id, date, discount }).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

