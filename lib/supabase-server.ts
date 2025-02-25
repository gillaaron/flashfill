import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const createServerSupabaseClient = () => createServerComponentClient({ cookies })

export async function getUserRole(userId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("user_roles")
    .select("role, business_id, outlet_id")
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching user role:", error)
    return null
  }

  return data
}

