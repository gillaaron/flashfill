"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"

interface WithAuthProps {
  user?: User
}

export function withAuth<P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[] = [],
) {
  return function WithAuthComponent(props: Omit<P, keyof WithAuthProps>) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (!user) {
            router.push("/login")
            return
          }

          const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single()

          if (!roleData || (allowedRoles.length > 0 && !allowedRoles.includes(roleData.role))) {
            router.push("/unauthorized")
            return
          }

          setUser(user)
        } catch (error) {
          console.error("Auth error:", error)
          router.push("/login")
        } finally {
          setLoading(false)
        }
      }

      checkAuth()
    }, [router, supabase, allowedRoles])

    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (!user) {
      return null
    }

    return <WrappedComponent {...(props as P)} user={user} />
  }
}

