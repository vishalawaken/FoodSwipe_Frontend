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

    // Helper function to update Redux cart count
    const updateReduxCartCount = (cartData) => {
        if (!cartData || !cartData.items) {
            dispatch(resetCart());
            return;
        }
        let totalQty = 0;
        for (let i = 0; i < cartData.items.length; i++) {
            totalQty = totalQty + cartData.items[i].quantity;
        }
        dispatch(setCartCount(totalQty));
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/cart", { withCredentials: true });
            setCart(res.data.cart);
            updateReduxCartCount(res.data.cart);
        } catch (error) {
            console.error("Error Fetching Cart", error);
            setCart(null);
            dispatch(resetCart());
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCart();
    }, [])

    // RemoveItem from the cart
    const removeItem = async (menuItemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/remove/${menuItemId}`, { withCredentials: true });
            fetchCart();
        } catch (error) {
            alert("failed to clear Item  form the Cart")
        }
    }

    // Clear Cart
    const clearCart = async () => {
        try {
            await axios.delete("http://localhost:5000/api/cart/clear", { withCredentials: true });
            setCart(null);
            dispatch(resetCart());
        } catch (error) {
            alert("failed to clear Cart")
        }
    }

    // Loading State
    if (loading) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-8">
                <p>Loading Cart.....</p>
            </div>
        )
    }

    // Empty Cart
    if (!cart || cart.items.length === 0) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-8">
                <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
                <p className="text-gray-500">Your Cart is Empty</p>
                <Link href="/" className="mt-4 inline-block text-blue-600 underline">Browse Restaurants</Link>
            </div>
        )
    }
    // Total Calculation 
    let totalAmount = 0;

    for (let i = 0; i < cart.items.length; i++) {
        const item = cart.items[i];
        totalAmount += item.menuItem.price * item.quantity;
    }


    // Update quantity
    const updateQuantity = async (menuItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await axios.patch(
                `http://localhost:5000/api/cart/update/${menuItemId}`,
                { quantity: newQuantity },
                { withCredentials: true }
            );
            fetchCart(); // refresh cart
        } catch (error) {
            alert(
                error?.response?.data?.message ||
                "Failed to update quantity"
            );
        }
    };

    // Place Order
    const handlePlaceOrder = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/order/place",
                {},
                { withCredentials: true }
            );
            dispatch(resetCart());
            router.push("/orders");
        } catch (error) {
            alert(
                error?.response?.data?.message ||
                "Failed to place order"
            );
        }
    };


    return (
        <>
            <div className="mx-auto max-w-4xl px-6 py-8">
                <h1 className="mb-6 text-2xl">Your Cart</h1>

                {/* Restaurant Information */}
                <p className="mb-4 text-gray-600">Restaurant Name
                    <span className="font-semibold">
                        {cart?.restaurant.name}
                    </span></p>

                {/* Cart Items */}
                <div className="space-y-4">{cart.items.map((item) => (<div key={item.menuItem._id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-semibold text-gray-800">{item.menuItem.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <button
                                disabled={item.quantity === 1}
                                onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                                className="h-8 w-8 rounded border text-lg disabled:opacity-40"
                            >
                                -
                            </button>
                            <span className="min-w-[20px] text-center font-medium">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                                className="h-8 w-8 rounded border text-lg"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-bold">
                            Rs{item.menuItem.price * item.quantity}
                        </span>
                        <button onClick={() => { removeItem(item.menuItem._id) }} className="text-red-600 hover:text-red-700">Remove</button>
                    </div>
                </div>))}</div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <span className="text-lg font-semibold">
                        Total: Rs{totalAmount}
                    </span>
                    <div className="flex gap-4">
                        <button onClick={clearCart} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Clear Cart</button>
                        <button onClick={handlePlaceOrder} className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700">Place Order</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartPage