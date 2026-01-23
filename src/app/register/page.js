"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"

import React from 'react'

const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [adminSecret, setAdminSecret] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleNameChange = (e) => {
    setName(e.target.value)
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const handleRoleChange = (e) => {
    setRole(e.target.value)
  }
  const handleAdminSecretChange = (e) => {
    setAdminSecret(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name,
        email,
        password,
        role,
      };

      if (role === "ADMIN") {
        payload.adminSecret = adminSecret;
      }

      await axios.post(
        "http://localhost:5000/api/auth/register",
        payload,
        { withCredentials: true }
      );

      // Role ke hisaab se redirect
      if (role === "RESTAURANT") {
        router.push("/restaurant-dashboard");
      } else if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
          <h1 className="mb-6 text-center text-2xl font-bold trext-gray-800">
            Register
          </h1>
          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input type="text" value={name} onChange={handleNameChange} placeholder="Enter your Name" className="w-full rounded border px-3 py-2 outline-none focus:ring"></input>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input type="email" value={email} placeholder="Enter Your Email" onChange={handleEmailChange} className="w-full rounded border px-3 py-2 outline-none focus:ring"></input>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full rounded border px-3 py-2 outline-none focus:ring"
                placeholder="••••••••"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <select value={role} onChange={handleRoleChange} className="w-full rounded border px-3 py-2 outline-none">
                <option value="USER">User</option>
                <option value="RESTAURANT">Restaurant Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* ADMIN SECRET */}
            {role === "ADMIN" && (<div>
              <label className="mb-1 block text-sm font-medium">Admin Secret</label>
              <input type="password" value={adminSecret} onChange={handleAdminSecretChange} className="w-full rounded border px-3 py-2 outline-none focus:ring" placeholder="Admin Secret"></input>
            </div>)}
            <button type="submit" disabled={loading} className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700 disabled:opacity-50">{loading ? "Registering..." : "Register"}</button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </div>
      </div></>
  )
}

export default RegisterPage