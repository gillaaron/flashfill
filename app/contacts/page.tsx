"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { withAuth } from "@/components/withAuth"

function ContactManagement() {
  const [contacts, setContacts] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [outlets, setOutlets] = useState([])
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    business_id: "",
    outlet_id: "",
  })
  const [userRole, setUserRole] = useState(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchUserRole()
    fetchContacts()
    fetchBusinesses()
    fetchOutlets()
  }, [])

  const fetchUserRole = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role, business_id, outlet_id")
        .eq("user_id", user.id)
        .single()
      if (data) setUserRole(data)
      if (error) console.error("Error fetching user role:", error)
    }
  }

  const fetchContacts = async () => {
    const { data, error } = await supabase.from("contacts").select("*, businesses(name), outlets(name)")
    if (data) setContacts(data)
    if (error) console.error("Error fetching contacts:", error)
  }

  const fetchBusinesses = async () => {
    const { data, error } = await supabase.from("businesses").select("id, name")
    if (data) setBusinesses(data)
    if (error) console.error("Error fetching businesses:", error)
  }

  const fetchOutlets = async () => {
    const { data, error } = await supabase.from("outlets").select("id, name, business_id")
    if (data) setOutlets(data)
    if (error) console.error("Error fetching outlets:", error)
  }

  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.from("contacts").insert(newContact)
    if (error) {
      alert("Error creating contact")
    } else {
      setNewContact({
        name: "",
        phone: "",
        email: "",
        business_id: "",
        outlet_id: "",
      })
      fetchContacts()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Form fields remain unchanged */}
      </form>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Existing Contacts</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Business</th>
              <th className="px-4 py-2">Outlet</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="border px-4 py-2">{contact.name}</td>
                <td className="border px-4 py-2">{contact.phone}</td>
                <td className="border px-4 py-2">{contact.email}</td>
                <td className="border px-4 py-2">{contact.businesses?.name}</td>
                <td className="border px-4 py-2">{contact.outlets?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default withAuth(ContactManagement, ["admin", "brand_manager", "outlet_manager"])

