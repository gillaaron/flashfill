import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import BusinessesClient from "./businesses-client"
import { redirect } from "next/navigation"

async function getBusinessesData() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role, business_id")
    .eq("user_id", user.id)
    .single()

  if (!userRole) {
    redirect("/unauthorized")
  }

  if (userRole.role !== "admin" && userRole.role !== "brand_manager") {
    redirect("/unauthorized")
  }

  let query = supabase.from("businesses").select("*")

  if (userRole.role === "brand_manager") {
    query = query.eq("id", userRole.business_id)
  }

  const { data: businesses } = await query

  return businesses
}

export default async function BusinessesPage() {
  const businesses = await getBusinessesData()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessesClient initialData={businesses} />
    </Suspense>
  )
}

