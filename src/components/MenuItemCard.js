"use client"
import axios from "axios"
import { useState } from "react"



const MenuItemCard = ({ item }) => {
    const [loading, setLoading] = useState(false);
    const handleAddToCart = async () => {
        try {
            setLoading(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`, { menuItemId: item._id, quantity: 1 }, { withCredentials: true });
            alert("Item added to the Cart")
        } catch (error) {
            console.error("Error adding item to cart", error)
            alert(error?.response?.data?.message || "Failed to add item to cart")
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800">
                    {item.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{item.description} || `Delicious Food Available` </p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Rs{item.price}</span>
                    <button onClick={handleAddToCart} disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                        {loading ? "Adding..." : "Add to Cart"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default MenuItemCard