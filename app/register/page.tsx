"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (res.ok) {
      toast.success(`✅ ${data.message}`);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      toast.error(`⚠️ ${data.message}`);
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
          <h2 className="text-3xl font-bold mb-6 text-gray-800">📝 Register</h2>

          <input
            name="fullName"
            placeholder="Full Name"
            className="w-full text-lg py-4 px-6 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition shadow-sm mb-4"
            onChange={handleChange}
            required
          />

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
            🚀 Register
          </button>

          <p
            onClick={() => {
              router.push("/login");
            }}
            className="mt-4 text-blue-600 cursor-pointer hover: underline"
          >
            Have you have account already? Log In
          </p>
        </form>
      </main>
    </>
  );
}
