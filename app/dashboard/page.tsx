import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import DashboardClient from "./dashboard-client"
import { redirect } from "next/navigation"

async function getDashboardData() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role, business_id, outlet_id")
    .eq("user_id", user.id)
    .single()

  if (!userRole) {
    redirect("/unauthorized")
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

  if (!appointments || !totalContacts) {
    return null
  }

  const totalAppointments = appointments.length
  const successfulAppointments = appointments.filter((a) => a.status === "confirmed").length

  return {
    totalContacts,
    totalAppointments,
    successfulAppointments,
    successRate: totalAppointments > 0 ? (successfulAppointments / totalAppointments) * 100 : 0,
  }
}

export default async function DashboardPage() {
  const initialData = await getDashboardData()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClient initialData={initialData} />
    </Suspense>
  )
}

