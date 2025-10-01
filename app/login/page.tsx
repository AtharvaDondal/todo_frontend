"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`✅ ${data.message}`);
        setTimeout(() => {
          router.push("/todos"); // Redirect AFTER showing toast
        }, 2000);
      } else {
        toast.error(`⚠️ ${data.message}`);
      }
    } catch (error) {
      toast.error("❌ Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">🔑 Login</h2>

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full text-lg py-4 px-6 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition shadow-sm mb-4"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full text-lg py-4 px-6 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition shadow-sm mb-6"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full text-xl font-semibold py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md cursor-pointer"
          >
            🚀 Login
          </button>
          <p
            onClick={() => {
              router.push("/register");
            }}
            className="mt-4 text-blue-600 cursor-pointer hover:underline"
          >
            Have you have new here? Register
          </p>
        </form>
      </main>
    </>
  );
}
