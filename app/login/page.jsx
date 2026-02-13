"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { FiLogIn } from "react-icons/fi";
import { api } from "@/lib/api";
import { useState } from "react";
import { GiEyelashes } from "react-icons/gi";
import { FaEye } from "react-icons/fa";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

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
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await api.login(values.email, values.password);

        localStorage.setItem("token", res.token);
        localStorage.setItem("auth", JSON.stringify(res.user));

        toast.success("Welcome!");
        router.push("/dashboard");
      } catch (err) {
        toast.error(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Toaster position="top-right" />

      <div className=" flex items-center justify-center min-h-screen bg-slate-900  text-white">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md p-6 bg-slate-800 rounded-xl shadow-xl/50 
           space-y-4"
        >
          <h1 className="text-2xl font-bold text-center text-violet-400 mb-6 ">
            Login
          </h1>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-3 rounded bg-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-3 rounded bg-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-violet-400"
            >
              {showPassword ? <FaEye size={20} /> : <GiEyelashes size={20} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-3 font-bold text-lg flex items-center justify-center gap-2 bg-emerald-400 text-slate-900 rounded-lg hover:bg-emerald-300 transition disabled:opacity-60 shadow-xl/30 cursor-pointer disabled:cursor-not-allowed"
          >
            <FiLogIn size={22} />
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </>
  );
}
