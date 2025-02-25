"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"

export function withAuth(WrappedComponent: React.ComponentType<{ user: User }>, allowedRoles: string[] = []) {
  return function AuthenticatedComponent(props: object) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const checkUser = useCallback(async () => {
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
    }, [router, supabase, allowedRoles])

    useEffect(() => {
      checkUser()
    }, [checkUser])

    if (loading) {
      return <div>Loading...</div>
    }

    if (user) {
      return <WrappedComponent {...props} user={user} />
    }

    return null
  }
}

