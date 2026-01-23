"use client"
import axios from "axios"
import { useState } from "react"

import React from 'react'

const CreateRestaurantForm = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("")
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        if (!name || !address) {
            setError("Name and Address are Required")
            return;
        }
        try {
            setLoading(true)
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/createRestaurant`, {
                name, description, address
            }, { withCredentials: true })
            onSuccess();
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to create restaurant")
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="rounded-lg border bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">Create Your Restaurant</h2>
                {error && (<p className="mb-4 text-sm text-red-600">{error}</p>)}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Restaurant Name */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Restaurant Name</label>
                        <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} className="w-full rounded-border px-3 py-2 outline-none focus:ring" placeholder="e.g. Rahul Dhaba"></input>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Description</label>
                        <textarea className="w-full rounded border px-2 py-2 outline-none focus:ring" value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder="Short Description(Optional)"></textarea>
                    </div>

                    {/* Address*/}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Address</label>
                        <textarea value={address} onChange={(e) => { setAddress(e.target.value) }} className="w-full rounded-border px-3 py-2 outline-none focus:ring" placeholder="Restaurant Address"></textarea>
                    </div>

                    <button type="submit" disabled={loading} className="rounded bg-green-600 px-6 text-white hover:bg-green-700 disabled:opacity-35">
                        {loading ? "Creating Restaurant..." : "Create Restaurant"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default CreateRestaurantForm