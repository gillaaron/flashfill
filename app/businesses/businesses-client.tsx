"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Business {
  id: string
  name: string
  registration_number: string
  address: string
  contact_name: string
  contact_number: string
  contact_email: string
}

interface BusinessesClientProps {
  initialData: Business[] | null
}

export default function BusinessesClient({ initialData }: BusinessesClientProps) {
  const [businesses, setBusinesses] = useState<Business[]>(initialData || [])
  const [newBusiness, setNewBusiness] = useState({
    name: "",
    registration_number: "",
    address: "",
    contact_name: "",
    contact_number: "",
    contact_email: "",
  })
  const supabase = createClientComponentClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBusiness({ ...newBusiness, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.from("businesses").insert(newBusiness).select()

    if (error) {
      alert("Error creating business")
      return
    }

    if (data) {
      setBusinesses([...businesses, ...data])
      setNewBusiness({
        name: "",
        registration_number: "",
        address: "",
        contact_name: "",
        contact_number: "",
        contact_email: "",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Business Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Business Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={newBusiness.name}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Other form fields remain the same */}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Business
          </button>
        </div>
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

