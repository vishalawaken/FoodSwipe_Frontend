"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"



const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("All Fields Are Required")
            return
        }
        try {
            setLoading(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { email, password }, { withCredentials: true })

            // Fetch user data to get role
            const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { withCredentials: true })
            const user = userRes.data.user;

            // Role-based redirect
            if (user.role === "RESTAURANT") {
                router.push("/restaurant-dashboard");
            } else if (user.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to Login")
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
                    <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Login</h1>
                    {error && (<p className="mb-4 text-sm text-red-400">{error}</p>)}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Email</label>
                            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="w-full rounded border px-3 py-2 mb-4 outline-none focus:ring" placeholder="example@example.com"></input>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Password</label>
                            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="w-full rounded border px-3 py-2 outline-none focus:ring" placeholder="......"></input>
                        </div>
                        <button type="submit" disabled={loading} className="w-full rounded bg-green-600 py-2 mt-6 text-white hover:bg-green-700 disabled:opacity-50">
                            {loading ? "Logging In...." : "Login"}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">Dont have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link></p>
                </div>
            </div>
        </>
    )
}

export default LoginPage