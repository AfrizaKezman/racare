"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import {
  LockClosedIcon,
  UserIcon,
  EnvelopeIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Login
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          login({
            id: data.user.id,
            username: data.user.username,
            fullName: data.user.fullName,
            role: data.user.role,
          });
          Swal.fire({
            icon: "success",
            title: "Login Berhasil!",
            text: `Selamat datang, ${
              data.user.fullName || data.user.username
            }`,
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            if (data.user.role === "admin") {
              router.push("/admin/products");
            } else {
              router.push("/products");
            }
          }, 1600);
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Gagal",
            text: data.message || "Login gagal",
          });
        }
      } else {
        // Register
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            role: "user",
          }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          Swal.fire({
            icon: "success",
            title: "Registrasi Berhasil!",
            text: `${data.message}\nSilakan login dengan akun baru Anda.`,
            showConfirmButton: true,
          });
          setFormData({ username: "", email: "", password: "", fullName: "" });
          setIsLogin(true);
        } else {
          Swal.fire({
            icon: "error",
            title: "Registrasi Gagal",
            text: data.message || "Registrasi gagal",
          });
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", email: "", password: "", fullName: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="flex flex-col items-center mb-4">
          <span className="text-2xl font-bold text-pink-500 mb-1 flex items-center gap-2">
            <UserIcon className="w-7 h-7 text-pink-400" /> racare.glow
          </span>
        </div>
        <h2 className="text-center text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
          {isLogin ? (
            <LockClosedIcon className="w-5 h-5 text-pink-400" />
          ) : (
            <UserPlusIcon className="w-5 h-5 text-pink-400" />
          )}
          {isLogin ? "Login" : "Register"}
        </h2>
        {/* Tombol Demo Akun */}
        <button
          type="button"
          onClick={() => {
            Swal.fire({
              title: "Akun Demo",
              html: `<div style='text-align:left'>
              <div><b>admin</b> / <span style='font-family:monospace'>123123</span></div>
              <div><b>fer</b> / <span style='font-family:monospace'>123123</span></div>
            </div>`,
              icon: "info",
              confirmButtonText: "Tutup",
              customClass: {
                popup: "rounded-xl",
                title: "text-pink-500",
                confirmButton: "bg-pink-500 text-white",
              },
            });
          }}
          className="w-full mb-3 py-2 rounded bg-pink-100 text-pink-500 font-semibold text-xs hover:bg-pink-200 transition focus:outline-none"
        >
          Lihat Akun Demo
        </button>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute left-2 top-2.5">
                <UserIcon className="w-4 h-4 text-pink-300" />
              </span>
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength={3}
                className="block w-full pl-8 px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>
          {/* Email Field - Only for Register */}
          {!isLogin && (
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute left-2 top-2.5">
                  <EnvelopeIcon className="w-4 h-4 text-pink-300" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-8 px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>
          )}
          {/* Full Name Field - Only for Register (Optional) */}
          {!isLogin && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Nama Lengkap{" "}
                <span className="text-gray-300">(Opsional)</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400"
                placeholder="Nama Lengkap"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          )}
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute left-2 top-2.5">
                <LockClosedIcon className="w-4 h-4 text-pink-300" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="block w-full pl-8 px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-pink-500 text-white font-semibold text-sm hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : isLogin ? (
              <LockClosedIcon className="w-5 h-5 text-white" />
            ) : (
              <UserPlusIcon className="w-5 h-5 text-white" />
            )}
            {loading
              ? isLogin
                ? "Login..."
                : "Mendaftar..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>
        <button
          onClick={toggleMode}
          disabled={loading}
          className="w-full text-center text-xs text-pink-500 hover:text-pink-600 mt-4 focus:outline-none disabled:opacity-50"
        >
          {isLogin
            ? "Belum punya akun? Register"
            : "Sudah punya akun? Login"}
        </button>
      </div>
    </div>
  );
}