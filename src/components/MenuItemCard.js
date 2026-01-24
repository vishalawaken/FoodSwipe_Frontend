"use client"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const MenuItemCard = ({ item }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        try {
            setLoading(true);
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`,
                { menuItemId: item._id, quantity: 1 },
                { withCredentials: true }
            );
            alert("Item added to the Cart");
        } catch (error) {
            if (error.response?.status === 401) {
                router.push("/login");
            } else {
                console.error("Error adding item to cart", error);
                alert(error?.response?.data?.message || "Failed to add item to cart");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg">

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {item.name}
            </h2>

            {/* Description */}
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {item.description || "Delicious food available"}
            </p>

            {/* Price + Action */}
            <div className="mt-5 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                    ₹{item.price}
                </span>

                <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="
            inline-flex items-center justify-center
            rounded-lg bg-blue-600 px-4 py-2
            text-sm font-medium text-white
            transition
            cursor-pointer
            hover:bg-blue-700
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:cursor-not-allowed disabled:opacity-50
          "
                >
                    {loading ? "Adding..." : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

export default MenuItemCard;