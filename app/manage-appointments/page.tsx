"use client"

import type React from "react"

import { useState, useEffect } from "react"

export default function ManageAppointments() {
  const [selectedDate, setSelectedDate] = useState("")
  const [discount, setDiscount] = useState("")
  const [message, setMessage] = useState("")
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/manage-appointments")
      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/manage-appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate, discount }),
      })

      const data = await response.json()
      setMessage(data.message)
      fetchAppointments()
    } catch (error) {
      setMessage("Error setting appointment")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Manage Appointments</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Select Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discount">
            Discount Percentage
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="discount"
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Set Appointment
        </button>
      </form>
      {message && <p className="mb-4">{message}</p>}
      <h2 className="text-xl font-bold mb-2">Existing Appointments</h2>
      <ul>
        {appointments.map((appointment: any) => (
          <li key={appointment.id}>
            Date: {appointment.date}, Discount: {appointment.discount}%
          </li>
        ))}
      </ul>
    </div>
  )
}

