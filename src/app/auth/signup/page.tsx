"use client";

import Link from "next/link";

import { useState } from "react";

import { supabase } from "@/app/lib/supabase";

import {
  Eye,
  EyeOff
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function SignupPage() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: ""

    });

  const router =
    useRouter();

  // TOAST MESSAGE STATE
  const [toast, setToast] = useState({
    open: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  function showToast(
    title: string,
    message: string,
    type: "success" | "error" = "success"
  ) {

    setToast({
      open: true,
      title,
      message,
      type,
    });

    // AUTO CLOSE
    setTimeout(() => {

      setToast((prev) => ({
        ...prev,
        open: false
      }));

    }, 3000);

  }

  async function handleSignup(
    e: React.FormEvent
  ) {

    e.preventDefault();

    // REMOVE EXTRA SPACES
    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    const phone =
      formData.phone.trim();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;

    // EMPTY VALIDATION
    if (
      !name ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      showToast(
        "Missing Fields",
        "Please complete all fields.",
        "error"
      );

      return;

    }

    // NAME VALIDATION
    const nameRegex =
      /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name)) {

    showToast(
      "Invalid Name",
      "Full name must contain letters only.",
      "error"
    );

      return;

    }

    if (name.length < 3) {

      showToast(
        "Invalid Name",
        "Full name must be at least 3 characters.",
        "error"
      );

      return;

    }

    // PHONE VALIDATION
    const phoneRegex =
      /^09\d{9}$/;

    if (!phoneRegex.test(phone)) {

      showToast(
        "Invalid Phone Number",
        "Phone number must be 11 digits and start with 09.",
        "error"
      );

      return;

    }

    // EMAIL VALIDATION
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      showToast(
        "Invalid Email",
        "Please enter a valid email address.",
        "error"
      );

      return;

    }

    // PASSWORD VALIDATION
    if (password.length < 8) {

      showToast(
        "Weak Password",
        "Password must be at least 8 characters.",
        "error"
      );

      return;

    }

    // MUST CONTAIN:
    // uppercase, lowercase, number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!passwordRegex.test(password)) {

      showToast(
        "Weak Password",
        "Password must contain uppercase, lowercase, and number.",
        "error"
      );

      return;

    }

    // CONFIRM PASSWORD
    if (
      password !== confirmPassword
    ) {

      showToast(
        "Password Error",
        "Passwords do not match.",
        "error"
      );

      return;

    }

    try {

      setLoading(true);

      const { error } =
        await supabase.auth.signUp({

          email,

          password,

          options: {

            emailRedirectTo:
              `${window.location.origin}/auth/login`,

            data: {

              full_name: name,
              phone: phone

            }

          }

        });

      setLoading(false);

      if (error) {

        showToast(
          "Signup Error",
          error.message,
          "error"
        );

        return;

      }

      showToast(
        "Account Created",
        "Please verify your email before logging in.",
        "success"
      );

      router.push(
        "/auth/login"
      );

    } catch (error) {

      setLoading(false);

      showToast(
        "System Error",
        "Something went wrong.",
        "error"
      );

    }

  }

return (

  <div
    className="relative min-h-screen w-full flex justify-center items-center px-4 py-8 sm:px-6 lg:px-8 overflow-hidden"
    style={{
      backgroundImage: "url('/assets/images/krave-cover.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* optional dark overlay (recommended for readability) */}
    <div className="fixed inset-0 bg-black/40" />

    {/* SIGNUP CARD */}
    <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl w-full max-w-md border border-slate-100">
      
      {/* LOGO + TITLE */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white ring-4 ring-blue-100 mb-4">
          <img
            src="/logo.jpg"
            alt="Krave Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-900">
          Create Account
        </h1>

        <p className="text-center text-slate-500 mt-2 text-sm sm:text-base">
          Join Krave today
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSignup}
        className="space-y-4"
      >

        {/* FULL NAME */}
        <input
          type="text"
          placeholder="Full name"
          className="w-full p-3 sm:p-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition text-sm sm:text-base"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
        />

        {/* PHONE */}
        <input
          type="tel"
          placeholder="09XXXXXXXXX"
          maxLength={11}
          className="w-full p-3 sm:p-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition text-sm sm:text-base"
          value={formData.phone}
          onChange={(e) => {

            const value =
              e.target.value.replace(/\D/g, "");

            setFormData({
              ...formData,
              phone: value
            });

          }}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 sm:p-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition text-sm sm:text-base"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value
            })
          }
        />

        {/* PASSWORD */}
        <div className="relative">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            className="w-full p-3 sm:p-3.5 pr-12 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition text-sm sm:text-base"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value
              })
            }
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
          >

            {
              showPassword
                ? <Eye size={18} />
                : <EyeOff size={18} />
            }

          </button>

        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative">

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            className="w-full p-3 sm:p-3.5 pr-12 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition text-sm sm:text-base"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmPassword: e.target.value
              })
            }
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
          >

            {
              showConfirmPassword
                ? <Eye size={18} />
                : <EyeOff size={18} />
            }

          </button>

        </div>

        {/* SUBMIT BUTTON */}
        <button
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white transition ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >

          {
            loading
              ? "Creating..."
              : "Create Account"
          }

        </button>

      </form>

      {/* LOGIN LINK */}
      <p className="text-center mt-6 text-sm sm:text-base text-slate-600">

        Already have account?

        <Link
          href="/auth/login"
          className="text-blue-600 ml-2 font-medium hover:underline"
        >

          Login

        </Link>

      </p>

    </div>

    {/* TOAST MESSAGE */}
    {toast.open && (

      <div className="fixed top-5 right-5 z-50">

        <div
          className={`w-[300px] p-4 rounded-xl shadow-lg border backdrop-blur-md animate-in fade-in slide-in-from-right duration-300 ${
            toast.type === "success"
              ? "bg-white border-green-200"
              : "bg-white border-red-200"
          }`}
        >

          <div className="flex items-start gap-3">

            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                toast.type === "success"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >

              {toast.type === "success" ? "✓" : "!"}

            </div>

            <div className="flex-1">

              <h3 className="text-sm font-semibold text-slate-900">
                {toast.title}
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                {toast.message}
              </p>

            </div>

          </div>

        </div>

      </div>

    )}

  </div>

)

}