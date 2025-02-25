"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { withAuth } from "@/components/withAuth"

function OutletManagement() {
  const [outlets, setOutlets] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [newOutlet, setNewOutlet] = useState({
    business_id: "",
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    contact_person: "",
    contact_number: "",
    email: "",
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchOutlets()
    fetchBusinesses()
  }, [])

  const fetchOutlets = async () => {
    const { data, error } = await supabase.from("outlets").select("*, businesses(name)")
    if (data) setOutlets(data)
    if (error) console.error("Error fetching outlets:", error)
  }

  const fetchBusinesses = async () => {
    const { data, error } = await supabase.from("businesses").select("id, name")
    if (data) setBusinesses(data)
    if (error) console.error("Error fetching businesses:", error)
  }

  const handleInputChange = (e) => {
    setNewOutlet({ ...newOutlet, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.from("outlets").insert(newOutlet)
    if (error) {
      alert("Error creating outlet")
    } else {
      setNewOutlet({
        business_id: "",
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        contact_person: "",
        contact_number: "",
        email: "",
      })
      fetchOutlets()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Outlet Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Form fields remain unchanged */}
      </form>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Existing Outlets</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Business</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Contact Person</th>
              <th className="px-4 py-2">Contact Number</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {outlets.map((outlet) => (
              <tr key={outlet.id}>
                <td className="border px-4 py-2">{outlet.businesses.name}</td>
                <td className="border px-4 py-2">{outlet.name}</td>
                <td className="border px-4 py-2">{outlet.address}</td>
                <td className="border px-4 py-2">{outlet.contact_person}</td>
                <td className="border px-4 py-2">{outlet.contact_number}</td>
                <td className="border px-4 py-2">{outlet.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default withAuth(OutletManagement, ["admin", "brand_manager"])

