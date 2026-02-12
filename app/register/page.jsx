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
        .min(6, "At least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        // TODO → replace with backend call
        await new Promise((res) => setTimeout(res, 1200));

        toast.success("Account created!");
        router.push("/login");
      } catch (error) {
        toast.error("Registration failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-slate-800 p-8 rounded-xl w-96"
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
            className="w-full p-2 mb-2 bg-slate-700 rounded text-violet-300"
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
              className="w-full p-2 mb-2 bg-slate-700 rounded text-violet-300 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-violet-400"
            >
              {showPassword ? <FaEye /> : <GiEyelashes />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-400 text-xs mb-3">
              {formik.errors.password}
            </p>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-green-300 py-2 rounded hover:bg-green-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {formik.isSubmitting && (
              <Loader2 className="animate-spin" size={18} />
            )}
            {formik.isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </>
  );
}
