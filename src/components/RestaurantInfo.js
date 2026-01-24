"use client"
import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

const RestaurantInfo = ({ refresh, restaurant }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter()
    const toggleStatus = async () => {
        setError("")
        try {
            setLoading(true)
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurant._id}/toggleStatus`, {}, { withCredentials: true })
            refresh();

        } catch (error) {
            setError(error?.response?.data?.message || "Failed to toggle restaurant status")
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="rounded-lg border bg-white p-6 shadow">
                <h2 className="mb-2 text-xl font-bold">{restaurant.name}</h2>
                {restaurant.description && (
                    <p className="mb-2 text-gray-600">{restaurant.description}</p>
                )}
                <p className="mb-2 text-gray-600">Address: {restaurant.address}</p>

                {/* Status */}
                <div className="mb-4 space-y-1 text-sm">
                    <p>Approval Status:{""}<span className={`font-semibold ${restaurant.isApproved ? "text-green-600" : "text-yellow-600"}`}>
                        {restaurant.isApproved ? "Approved" : " Pending Approval"}
                    </span></p>
                    <p>Restaurant Status:{""}
                        <span className={`font-semibold ${restaurant.isOpen ? "text-green-600" : "text-red-600"}`}>
                            {restaurant.isOpen ? "Open" : "Closed"}
                        </span>
                    </p>
                </div>

                {/* Error */}
                {error && (<p className="mb-4 text-sm text-red-600">{error}</p>)}

                {/* ACTIONS */}
                <div className="flex gap-4">
                    <button onClick={toggleStatus} disabled={loading || !restaurant.isApproved} className={`rounded px-4 py-2 text-sm text-white ${restaurant.isApproved ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-400"}`}>{
                        loading ? "Updating...." : restaurant.isOpen ? "Close Restaurant" : "Open Restaurant"
                    }</button>
                    <Link className="inline-block rounded bg-amber-300 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400" href={`/restaurant-dashboard/menu/${restaurant._id}`}>Manage Menu</Link>

                </div>
            </div>
        </>
    )
}

export default RestaurantInfo