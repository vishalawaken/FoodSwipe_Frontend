"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { setCartCount, resetCart } from "@/store/cartSlice"
import { useRouter } from "next/navigation"

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const updateReduxCartCount = (cartData) => {
        if (!cartData || !cartData.items) {
            dispatch(resetCart());
            return;
        }
        let totalQty = 0;
        for (let i = 0; i < cartData.items.length; i++) {
            totalQty += cartData.items[i].quantity;
        }
        dispatch(setCartCount(totalQty));
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
                { withCredentials: true }
            );
            setCart(res.data.cart);
            updateReduxCartCount(res.data.cart);
        } catch (error) {
            console.error("Error Fetching Cart", error);
            // If unauthorized, redirect to login
            if (error.response?.status === 401) {
                router.push("/login");
                return;
            }
            setCart(null);
            dispatch(resetCart());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const removeItem = async (menuItemId) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove/${menuItemId}`,
                { withCredentials: true }
            );
            fetchCart();
        } catch (error) {
            alert("Failed to remove item");
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear`,
                { withCredentials: true }
            );
            setCart(null);
            dispatch(resetCart());
        } catch (error) {
            alert("Failed to clear cart");
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12 text-center">
                <p className="text-gray-500">Loading cart...</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-12 text-center">
                <h1 className="mb-3 text-2xl font-semibold">Your Cart</h1>
                <p className="text-gray-500">Your cart is empty</p>
                <Link
                    href="/"
                    className="mt-4 inline-block rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Browse Restaurants
                </Link>
            </div>
        );
    }

    let totalAmount = 0;
    for (let i = 0; i < cart.items.length; i++) {
        totalAmount += cart.items[i].menuItem.price * cart.items[i].quantity;
    }

    const updateQuantity = async (menuItemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/update/${menuItemId}`,
                { quantity: newQuantity },
                { withCredentials: true }
            );
            fetchCart();
        } catch (error) {
            alert("Failed to update quantity");
        }
    };

    const handlePlaceOrder = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/order/place`,
                {},
                { withCredentials: true }
            );
            dispatch(resetCart());
            router.push("/orders");
        } catch (error) {
            if (error.response?.status === 401) {
                router.push("/login");
            } else {
                alert(error?.response?.data?.message || "Failed to place order");
            }
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <h1 className="mb-6 text-2xl font-semibold">Your Cart</h1>

            {/* Restaurant Info */}
            <p className="mb-6 text-sm text-gray-600">
                Restaurant:
                <span className="ml-1 font-semibold text-gray-800">
                    {cart.restaurant.name}
                </span>
            </p>

            {/* Cart Items */}
            <div className="space-y-4">
                {cart.items.map((item) => (
                    <div
                        key={item.menuItem._id}
                        className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        <div>
                            <h3 className="font-medium text-gray-800">
                                {item.menuItem.name}
                            </h3>

                            <div className="mt-2 flex items-center gap-3">
                                <button
                                    disabled={item.quantity === 1}
                                    onClick={() =>
                                        updateQuantity(
                                            item.menuItem._id,
                                            item.quantity - 1
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-full border text-lg hover:bg-gray-100 disabled:opacity-40"
                                >
                                    −
                                </button>

                                <span className="min-w-[24px] text-center font-medium">
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item.menuItem._id,
                                            item.quantity + 1
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-full border text-lg hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">
                                ₹{item.menuItem.price * item.quantity}
                            </span>
                            <button
                                onClick={() => removeItem(item.menuItem._id)}
                                className="text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-lg font-semibold">
                    Total: ₹{totalAmount}
                </span>

                <div className="flex gap-3">
                    <button
                        onClick={clearCart}
                        className="rounded-md border border-red-600 px-4 py-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                        Clear Cart
                    </button>

                    <button
                        onClick={handlePlaceOrder}
                        className="rounded-md bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;