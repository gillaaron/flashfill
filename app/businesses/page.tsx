"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { withAuth } from "@/components/withAuth"

function BusinessManagement() {
  const [businesses, setBusinesses] = useState([])
  const [newBusiness, setNewBusiness] = useState({
    name: "",
    registration_number: "",
    address: "",
    contact_name: "",
    contact_number: "",
    contact_email: "",
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    const { data, error } = await supabase.from("businesses").select("*")
    if (data) setBusinesses(data)
    if (error) console.error("Error fetching businesses:", error)
  }

  const handleInputChange = (e) => {
    setNewBusiness({ ...newBusiness, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.from("businesses").insert(newBusiness)
    if (error) {
      alert("Error creating business")
    } else {
      setNewBusiness({
        name: "",
        registration_number: "",
        address: "",
        contact_name: "",
        contact_number: "",
        contact_email: "",
      })
      fetchBusinesses()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Business Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Form fields remain unchanged */}
      </form>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Existing Businesses</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Registration Number</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Contact Name</th>
              <th className="px-4 py-2">Contact Number</th>
              <th className="px-4 py-2">Contact Email</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr key={business.id}>
                <td className="border px-4 py-2">{business.name}</td>
                <td className="border px-4 py-2">{business.registration_number}</td>
                <td className="border px-4 py-2">{business.address}</td>
                <td className="border px-4 py-2">{business.contact_name}</td>
                <td className="border px-4 py-2">{business.contact_number}</td>
                <td className="border px-4 py-2">{business.contact_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default withAuth(BusinessManagement, ["admin", "brand_manager"])

