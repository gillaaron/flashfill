"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [outlets, setOutlets] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchUsers()
    fetchBusinesses()
    fetchOutlets()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("auth.users").select(`
        *,
        user_profiles (username, contact_number),
        user_roles (role, business_id, outlet_id)
      `)
    if (data) setUsers(data)
  }

  const fetchBusinesses = async () => {
    const { data, error } = await supabase.from("businesses").select("*")
    if (data) setBusinesses(data)
  }

  const fetchOutlets = async () => {
    const { data, error } = await supabase.from("outlets").select("*")
    if (data) setOutlets(data)
  }

  const updateUserRole = async (userId, role, businessId = null, outletId = null) => {
    const { data, error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role, business_id: businessId, outlet_id: outletId })

    if (error) {
      alert("Error updating user role")
    } else {
      fetchUsers()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Contact Number</th>
            <th>Role</th>
            <th>Business</th>
            <th>Outlet</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.user_profiles?.username}</td>
              <td>{user.user_profiles?.contact_number}</td>
              <td>{user.user_roles?.role || "N/A"}</td>
              <td>{businesses.find((b) => b.id === user.user_roles?.business_id)?.name || "N/A"}</td>
              <td>{outlets.find((o) => o.id === user.user_roles?.outlet_id)?.name || "N/A"}</td>
              <td>
                <select value={user.user_roles?.role || ""} onChange={(e) => updateUserRole(user.id, e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="brand_manager">Brand Manager</option>
                  <option value="outlet_manager">Outlet Manager</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

