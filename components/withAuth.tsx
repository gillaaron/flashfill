"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function withAuth(WrappedComponent, allowedRoles = []) {
  return function AuthenticatedComponent(props) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
      async function checkUser() {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single()

          if (roleData && (!allowedRoles.length || allowedRoles.includes(roleData.role))) {
            setUser(user)
          } else {
            router.push("/unauthorized")
          }
        } else {
          router.push("/login")
        }
        setLoading(false)
      }

      checkUser()
    }, [allowedRoles.length, router.push, supabase.auth.getUser, supabase.from]) // Added dependencies here

    if (loading) {
      return <div>Loading...</div>
    }

    if (user) {
      return <WrappedComponent {...props} user={user} />
    }

    return null
  }
}

