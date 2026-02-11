"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { GiEyelashes } from "react-icons/gi";
import { FaEye } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        // 🔁 Replace with real API call
        await new Promise((res) => setTimeout(res, 1500));

        toast.success("✨ Account created successfully! Redirecting to login...", { duration: 2000 });
        router.push("/login");
      } catch (error) {
        const message = "Registration failed. Please try again.";
        toast.error(message, { duration: 3000 });
        console.error("Registration error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-slate-800 p-8 rounded-xl w-96 inset-shadow-sm inset-shadow-indigo-500/50"
        >
          <h2 className="text-2xl font-bold mb-6 text-violet-400">Register</h2>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full p-2 mb-3 bg-slate-700 rounded text-violet-400 inset-shadow-sm inset-shadow-indigo-400/30 outline-none"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-400 text-xs mb-3">{formik.errors.email}</p>
          )}

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full p-2 mb-3 bg-slate-700 rounded text-violet-400 inset-shadow-sm inset-shadow-indigo-400/30 outline-none pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2.5 text-violet-400 hover:text-violet-300"
            >
              {showPassword ? <FaEye size={22} /> : <GiEyelashes size={23} />}
            </button>
          </div>

          {formik.touched.password && formik.errors.password && (
            <p className="text-red-400 text-xs mb-4">
              {formik.errors.password}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-green-300 py-2 rounded hover:bg-green-200 transition-all ease-in duration-200 cursor-pointer shadow-md shadow-indigo-300/30 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {formik.isSubmitting && (
              <Loader2 className="animate-spin text-violet-900" size={18} />
            )}
            <span className="text-violet-800 font-medium text-md">
              {formik.isSubmitting ? "Creating..." : "Create Account"}
            </span>
          </button>
        </form>
      </div>
    </>
  );
}
