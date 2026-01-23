"use client"

import { useEffect,useState } from "react"
import axios from "axios"

import React from 'react'

const AdminPage = () => {
    const[restaurants,setRestaurants]=useState([]);
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState("")

    const fetchPendingRestaurants=async()=>{
        try {
            setLoading(true);
            const res=await axios.get(`http://localhost:5000/api/restaurants/pendingRestaurants`,{withCredentials:true})
            setRestaurants(res.data.restuarants || []);

        } catch (error) {
            setError("Failed to Load Pending Restaurants")
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{fetchPendingRestaurants()},[])

    const approveRestaurant=async(restaurantId)=>{
        try {
            await axios.patch(`http://localhost:5000/api/restaurants/${restaurantId}/approve`,
        {},
        { withCredentials: true })
        fetchPendingRestaurants();
        } catch (error) {
            alert("Failed to approve Restaurant")
        }
    }

    if(loading){
        return <p className="p-6">Loading Admin Panel</p>
    }
  return (
    <>
    <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Adming Panel -Pending Restaurants</h1>
        {error && (<p className="mb-4 text-sm text-red-600">{error}</p>)}

        {restaurants.length===0? (<p className="text-gray-500">No Pending Requests</p>):(<div className="space-y-4">
            {restaurants.map((restaurant)=>(
                <div key={restaurant._id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-semibold">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600">{restaurant.address}</p>
                        {restaurant.description && (<p className="text-xs text-gray-500">{restaurant.description}</p>)}
                    </div>
                    <button onClick={()=>{approveRestaurant(restaurant._id)}} className="rounded bg-green-600 px-4 py-1 text-sm text-white hover:bg-screen-700">Approve</button>
                </div>
            ))}
        </div>)}
    </div>
    </>
  )
}

export default AdminPage