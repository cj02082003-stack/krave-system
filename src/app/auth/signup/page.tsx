"use client";

import Link from "next/link";

import {
  useState
}
  from "react";

import {
  supabase
}
  from "@/app/lib/supabase";

import {
  Eye,
  EyeOff
}
  from "lucide-react";

import {
  useRouter
}
  from "next/navigation";

export default function SignupPage() {

  const [
    showPassword,
    setShowPassword
  ]
    =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [
    loading,
    setLoading
  ]
    =
    useState(false);


  const [
    formData,
    setFormData
  ]
    =
    useState({

      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: ""

    });


  const router =
    useRouter();


  async function handleSignup(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      alert("Complete all fields");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const {
      error
    }
      =
      await supabase.auth.signUp({

        email:
          formData.email,

        password:
          formData.password,

        options: {

          emailRedirectTo:
            "http://localhost:3000/auth/login",

          data: {

            full_name:
              formData.name

          }

        }

      });

    setLoading(false);

    if (error) {

      alert(
        error.message
      );

      return;

    }

    alert(
      "Account created!\nCheck your email verification."
    );

    router.push(
      "/auth/login"
    );

  }



  return (

    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-4">

      <div className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">

          Create Account

        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">

          Join Krave today

        </p>

        <form onSubmit={handleSignup} className="space-y-4">

          {/* FULL NAME */}
          <input
            type="text"
            placeholder="Full name"
            className="w-full p-3 border rounded-xl"
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
            placeholder="Phone number"
            className="w-full p-3 border rounded-xl"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value
              })
            }
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl"
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
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-10 border rounded-xl"
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
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD (separate state toggle) */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 pr-10 border rounded-xl"
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
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showConfirmPassword ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full py-3 bg-blue-600 rounded-xl text-white"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>


        <p className="text-center mt-6">

          Already have account?

          <Link
            href="/auth/login"
            className="text-blue-600 ml-2"
          >

            Login

          </Link>

        </p>

      </div>

    </div>

  )

}