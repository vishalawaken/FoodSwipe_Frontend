"use client"

import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCartCount, resetCart } from "@/store/cartSlice";

const Header = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    // Redux se cartCount read karo
    const cartCount = useSelector((state) => state.cart.cartCount);
    const dispatch = useDispatch();

    const router = useRouter();
    const pathname = usePathname(); // Track current route

    const fetchUser = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { withCredentials: true })
            setUser(res.data.user)
        } catch (error) {
            console.error("Error Fetching User", error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    // Cart count fetch function
    const fetchCartCount = useCallback(async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
                { withCredentials: true }
            );

            const cart = res.data.cart;

            if (!cart || !cart.items) {
                dispatch(setCartCount(0));
                return;
            }

            // total quantity using for loop
            let totalQty = 0;
            for (let i = 0; i < cart.items.length; i++) {
                totalQty = totalQty + cart.items[i].quantity;
            }

            dispatch(setCartCount(totalQty));
        } catch (error) {
            dispatch(setCartCount(0));
        }
    }, [dispatch]);

    // Re-fetch user whenever route changes
    useEffect(() => {
        fetchUser()
    }, [pathname])

    useEffect(() => {
        if (user?.role === "USER") {
            fetchCartCount();
        } else {
            dispatch(resetCart());
        }
    }, [user, fetchCartCount, dispatch])

    async function handleLogout() {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {}, { withCredentials: true })
            setUser(null);
            dispatch(resetCart());
            router.push("/login")
        } catch (error) {
            console.error("Logout Failed", error)
        }
    }
    return (
        <>
            <header className="w-full border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-gray-900">FoodSwipe</Link>

                    {/* Right Side */}
                    <nav className="flex items-center gap-6 text-gray-700">
                        {!user ? (<>
                            <Link href="/login" className="hover:text-gray-900">Login</Link>
                            <Link href="/register" className="hover:text-gray-900">Register</Link>
                        </>) : (<>
                            {/* USER */}
                            {user.role === "USER" && (<>
                                <Link href="/cart" className="relative hover:text-gray-900">
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <Link href="/orders" className="hover:text-gray-900">Orders</Link>
                            </>)}
                            {/* RESTAURANT */}
                            {user.role === "RESTAURANT" && (<Link href="/restaurant/dashboard/orders" className="hover:text-black">Restaurant Dashboard</Link>)}
                            {/* ADMIN */}
                            {user.role === "ADMIN" && (<Link href="/admin/dashboard" className="hover:text-black">Admin</Link>)}
                            <button disabled={loading} onClick={handleLogout} className="hover:text-black">{loading ? "Logging Out..." : "Logout"}</button>
                        </>)}
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Header