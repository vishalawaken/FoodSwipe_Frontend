"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const UserOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/order/my-orders`,
                { withCredentials: true }
            );
            setOrders(res.data.orders || []);
        } catch (error) {
            console.error("Failed to fetch user orders");
            // If unauthorized, redirect to login
            if (error.response?.status === 401) {
                router.push("/login");
                return;
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchOrders();

        const interval = setInterval(fetchOrders, 10000); // 🔁 auto refresh
        return () => clearInterval(interval);
    }, [fetchOrders]);

    if (loading) return <p className="p-6">Loading orders...</p>;

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold">My Orders</h1>

            {orders.length === 0 ? (
                <p>No orders yet</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="rounded-lg border p-4 shadow"
                        >
                            <p className="font-semibold">
                                Restaurant: {order.restaurant.name}
                            </p>

                            <p className="text-sm text-gray-600 mt-1">
                                Status:{" "}
                                <span className="font-bold">
                                    {order.status}
                                </span>
                            </p>

                            <div className="mt-2 text-sm">
                                {order.items.map((item) => (
                                    <p key={item.menuItem._id}>
                                        {item.menuItem.name} × {item.quantity}
                                    </p>
                                ))}
                            </div>

                            <p className="mt-2 font-bold">
                                Total: ₹{order.totalAmount}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserOrdersPage;
