"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"


const ORDER_STATUS_FLOW = {
    PLACED: ["PREPARING", "CANCELLED"],
    PREPARING: ["OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
}

import React from 'react'

const RestaurantOrderPage = () => {
    const playNotificationSound = () => {
        const audio = new Audio("/order_sound.mp3")
        audio.play().catch(error => console.error("Failed to play notification sound", error))
    }
    // const searchParams = useSearchParams();
    // const restaurantId = searchParams.get("restaurantId");
    const [restaurantId, setRestaurantId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch My Restaurant to get ID
    useEffect(() => {
        const fetchMyRestaurant = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/restaurants/myRestaurant", { withCredentials: true })
                if (res.data.restaurant) {
                    setRestaurantId(res.data.restaurant._id);
                }
            } catch (error) {
                console.error("Failed to fetch restaurant info", error);
                setLoading(false); // Stop loading if failed
            }
        }
        fetchMyRestaurant();
    }, []);

    // 2. Fetch Orders once we have Restaurant ID
    const fetchOrders = async () => {
        if (!restaurantId) return;

        try {
            const res = await axios.get(`http://localhost:5000/api/order/restaurant/${restaurantId}`,
                { withCredentials: true })
            const newOrders = res.data.orders || [];

            // 🔔 play sound if new order arrived (and not first load)
            if (orders.length > 0 && newOrders.length > orders.length) {
                playNotificationSound();
            }

            setOrders(newOrders);
        } catch (error) {
            console.error("Failed to fetch the restaurant Orders", error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (restaurantId) {
            fetchOrders();
            const interval = setInterval(() => { fetchOrders() }, 10000)
            return () => { clearInterval(interval) }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restaurantId])

    const updateStatus = async (orderId, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/order/${orderId}/status`,
                { status },
                { withCredentials: true })
            fetchOrders();
        } catch (error) {
            alert(error?.response?.data?.message || "Failed to update the order status")
        }
    }
    if (loading) {
        return <p className="p-6">Loading Orders....</p>
    }
    return (
        <>
            <div className="mx-auto max-w-5xl px-6 py-8">
                <h1 className="mb-6 text-2xl font-bold">Restautrant Orders</h1>
                {orders.length === 0 ? (<p>No Orders</p>) : (<div className="space-y-6">
                    {orders.map((order) => (<div key={order._id} className="rounded-lg border p-4 shadow">
                        <div className="flex justify-between">
                            <p className="font-semibold">Order By:{order.user.name}</p>
                            <span className="text-sm font-bold">Rs{order.totalAmount}</span>
                        </div>

                        {/* Items */}
                        <div className="mt-2 text-sm text-gray-700">
                            {order.items.map((item) => (<p key={item.menuItem._id}>{item.menuItem.name}*{item.quantity}</p>))}
                        </div>

                        {/* Status */}
                        <p className="mt-3 text-sm">
                            Current Status:{""}
                            <span className="font-semibold">
                                {order.status}
                            </span>
                        </p>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-3">
                            {ORDER_STATUS_FLOW[order.status]?.map((nextstatus) => (
                                <button key={nextstatus} onClick={() => { updateStatus(order._id, nextstatus) }} className="rounded bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700">Mark As {nextstatus}</button>
                            ))}
                        </div>
                    </div>))}
                </div>)}
            </div>
        </>
    )
}

export default RestaurantOrderPage