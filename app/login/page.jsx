"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { api } from "@/lib/api";
import { FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await api.login(values.email, values.password);

        if (result?.token) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("auth", JSON.stringify(result.user));

          toast.success("Login successful!");
          router.push("/dashboard");
        } else {
          toast.error(result?.message || "Login failed");
        }
      } catch (err) {
        toast.error(err.message || "Login failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Toaster position="top-right" />

      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md p-6 bg-slate-800 rounded-lg shadow-lg space-y-4"
        >
          <h1 className="text-2xl font-bold text-center">Login</h1>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-3 rounded bg-slate-700 outline-none"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-3 rounded bg-slate-700 outline-none"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-2 text-blue-900 font-bold text-lg cursor-pointer  bg-emerald-400 rounded-lg hover:rounded-xs transition-all ease-in duration-300 hover:bg-emerald-300 disabled:opacity-50"
          >
            <FiLogIn className="inline-block mr-2 " size={25} />
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-base font-normal ">
            Don't have an account?{" "}
            <a
              href="/register"
              className="ml-1 font-normal text-base  text-blue-600 hover:underline"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
