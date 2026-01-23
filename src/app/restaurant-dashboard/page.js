"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import CreateRestaurantForm from "@/components/CreateRestaurantForm"
import RestaurantInfo from "@/components/RestaurantInfo"



const RestaurantDashboard = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch owner's restaurant
    const fetchMyRestaurant = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get("http://localhost:5000/api/restaurants/myRestaurant", { withCredentials: true })
            setRestaurant(res.data.restaurant);
        } catch (error) {
            // 404 means no restaurant yet - not an error, show create form
            if (error?.response?.status === 404) {
                setRestaurant(null);
            } else {
                setError(error?.response?.data?.message || "Failed to fetch restaurant")
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMyRestaurant();
    }, [])
    if (loading) {
        return <p className="p-6">Loading Dashboard</p>
    }
    return (
        <>
            <div className="mx-auto max-w-5xl px-6 py-8">
                <h1 className="mb-6 text-2xl font-bold">
                    Resturant Dashboard
                </h1>

                {/* No Restaurant Found*/}
                {!restaurant && (<CreateRestaurantForm onSuccess={fetchMyRestaurant}></CreateRestaurantForm>)}

                {/* Restaurant Exists */}
                {restaurant && (<RestaurantInfo refresh={fetchMyRestaurant} restaurant={restaurant}></RestaurantInfo>)}

                {error && (<p className="mt-4 text-red-600">{error}</p>)}
            </div>
        </>
    )
}

export default RestaurantDashboard