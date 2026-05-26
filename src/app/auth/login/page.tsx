"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-6xl overflow-hidden bg-white rounded-[32px] shadow-2xl border border-slate-200 grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="p-8 md:p-12">

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">

          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">

            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>

          </div>

          <div>
            <h2 className="font-bold text-xl">
              Krave
              <span className="text-blue-600"> Restaurant</span>
            </h2>

            <p className="text-xs text-slate-500">
              Ordering Solution
            </p>
          </div>

        </div>

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Login to continue your journey
          </p>

        </div>

        <form className="space-y-5">

          {/* EMAIL */}

          <div>

            <label className="text-sm font-medium">
              Email
            </label>

            <div className="relative mt-2">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                placeholder="example@email.com"
                className="w-full pl-11 p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div>

            <label className="text-sm font-medium">
              Password
            </label>

            <div className="relative mt-2">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff size={20}/>
                ) : (
                  <Eye size={20}/>
                )}
              </button>

            </div>

          </div>

          <div className="flex justify-between text-sm">

            <label className="flex items-center gap-2">

              <input type="checkbox" />

              Remember me

            </label>

            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">

            Login

          </button>

        </form>

        <div className="my-6 flex items-center gap-3">

          <div className="flex-1 border-t" />

          <span className="text-sm text-slate-400">
            OR
          </span>

          <div className="flex-1 border-t" />

        </div>

        <button className="w-full border rounded-xl py-3 flex justify-center items-center gap-3 hover:bg-slate-50 transition">

          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5"
            alt=""
          />

          Continue with Google

        </button>

        <p className="text-center text-sm mt-8">

          No account yet?{" "}

          <Link
            href="/auth/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </div>

      {/* RIGHT SIDE */}

      <div className="hidden lg:flex relative bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center">

        <Image
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80"
          alt="Food"
          fill
          className="object-cover opacity-40"
        />

        <div className="relative z-10 p-10 text-white max-w-md">

          <h1 className="text-5xl font-bold leading-tight">

            Order Smarter. <br />
            Eat Better.

          </h1>

          <p className="mt-5 text-white/90 leading-7">

            Discover amazing meals and experience
            seamless ordering with Krave Kitchen.

          </p>

        </div>

      </div>

    </div>
  );
}