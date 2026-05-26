"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border">

      <h1 className="text-3xl font-bold text-center">
        Create Account
      </h1>

      <p className="text-slate-500 text-center mt-2 mb-8">
        Join Krave today
      </p>

      <form className="space-y-4">

        <input
          placeholder="Full Name"
          className="w-full p-3 border rounded-xl"
        />

        <input
          placeholder="Email"
          className="w-full p-3 border rounded-xl"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-xl"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
          Create Account
        </button>

      </form>

      <p className="text-center mt-6 text-sm">
        Already have account?{" "}
        <Link
          href="/auth/login"
          className="text-blue-600"
        >
          Login
        </Link>
      </p>

    </div>
  );
}