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

  const contactsQuery = supabase.from("contacts").select("count", { count: "exact" })
  let appointmentsQuery = supabase
    .from("appointments")
    .select("id, status, appointment_slots(outlet_id, outlets(business_id))")

  if (userRole.role === "outlet_manager") {
    appointmentsQuery = appointmentsQuery.eq("appointment_slots.outlet_id", userRole.outlet_id)
  } else if (userRole.role === "brand_manager") {
    appointmentsQuery = appointmentsQuery.eq("appointment_slots.outlets.business_id", userRole.business_id)
  }

  const [{ count: totalContacts }, { data: appointments }] = await Promise.all([contactsQuery, appointmentsQuery])

  const totalAppointments = appointments.length
  const successfulAppointments = appointments.filter((a) => a.status === "confirmed").length

  return NextResponse.json({
    totalContacts,
    totalAppointments,
    successfulAppointments,
    successRate: totalAppointments > 0 ? (successfulAppointments / totalAppointments) * 100 : 0,
  })
}

