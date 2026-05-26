"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Mail,
  Lock
} from "lucide-react";

import {
  useState
} from "react";

import {
  supabase
} from "@/app/lib/supabase";

import {
  useRouter
} from "next/navigation";

export default function LoginPage() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const router =
    useRouter();

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (!email || !password) {

    showToast("Missing Fields", "Please fill all fields", "error");

      return;

    }

    setLoading(true);

    const {
      data,
      error
    }
      =
      await supabase.auth
        .signInWithPassword({

          email,
          password

        });

    setLoading(false);

    if (error) {

      showToast("Login Error", error.message, "error");

      return;

    }

    if (
      !data.user.email_confirmed_at
    ) {

      showToast("Email Not Confirmed", "Please verify your email first.", "error");

      await supabase.auth.signOut();

      return;

    }

    showToast("Welcome to Krave Kitchen", "Login successful!", "success");

    router.push("/");

  }
  // TOAST MESSAGE STATE AND FUNCTION
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

    // auto close after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 3000);
  }
  return (

    <div className="w-full max-w-6xl mx-auto overflow-hidden bg-white rounded-2xl lg:rounded-[32px] shadow-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-2">

      <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">

        <div className="flex items-center gap-3 mb-8">

          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">

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
              <span className="text-blue-600">
               Kitchen
              </span>

            </h2>

            <p className="text-xs text-slate-500">
              Ordering Solution
            </p>

          </div>

        </div>

        <div className="mb-8 text-center">

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 ">

            LOGIN FORM

          </h1>

          <p className="text-slate-500 mt-2 text-sm sm:text-base">

            Login to continue your journey

          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="text-sm font-medium text-slate-700">Email</label>

            <div className="relative mt-2">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="example@email.com"
                className="w-full pl-12 pr-4 sm:pl-12 md:pl-12 p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm sm:text-base"
              />

            </div>

          </div>


          <div>

            <label className="text-sm font-medium text-slate-700">Password</label>

            <div className="relative mt-2">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="••••••••"
                className="w-full pl-12 pr-4 sm:pl-12 md:pl-12 p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm sm:text-base"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
              >

                {
                  showPassword
                    ?
                    <Eye size={20} />
                    :
                    <EyeOff size={20} />
                }

              </button>

            </div>
            {/* <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div> */}

          </div>


          <button
            disabled={loading}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-blue-600 text-white text-sm sm:text-base font-medium hover:bg-blue-700 active:scale-[0.99] transition"
          >

            {
              loading
                ?
                "Logging in..."
                :
                "Login"
            }

          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400 bg-white px-2">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.99] transition text-sm sm:text-base font-medium"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-[18px] h-[18px] shrink-0"
              />
              Continue with Google
            </button>
          </div>

        </form>

        <p className="text-center mt-6">

          No account?

          <Link
            href="/auth/signup"
            className="text-blue-600 ml-2"
          >

            Sign Up

          </Link>

        </p>

      </div>


      <div className="hidden lg:block relative bg-black/5">

        <Image
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80"
          alt="Food"
          fill
          className="object-cover"
        />

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
                    toast.type === "success" ? "bg-green-500" : "bg-red-500"
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