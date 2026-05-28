"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit?: (data: any) => void;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const { login, register: authRegister } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await login(formData.username, formData.password);
      } else {
        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await authRegister(formData.username, formData.email, formData.password, formData.fullName);
      }

      setSuccess(true);
      if (onSubmit) onSubmit({ success: true });

      // Clear form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
      });

      // Redirect after success
      setTimeout(() => {
        router.push("/en/news");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-slate-400 mb-8">
          {mode === "login"
            ? "Sign in to your account"
            : "Join us to start creating"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/70 transition-all"
              placeholder="your_username"
            />
          </div>

          {/* Email (Register only) */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/70 transition-all"
                placeholder="you@example.com"
              />
            </div>
          )}

          {/* Full Name (Register only) */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/70 transition-all"
                placeholder="John Doe"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/70 transition-all"
              placeholder="••••••••"
            />
            {mode === "register" && (
              <p className="text-xs text-slate-400 mt-1">
                Min 8 chars, 1 uppercase, 1 digit
              </p>
            )}
          </div>

          {/* Confirm Password (Register only) */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/70 transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-green-400 text-sm">
              {mode === "login" ? "Logged in successfully!" : "Account created successfully! Redirecting..."}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-sm">
          {mode === "login" ? (
            <>
              <span className="text-slate-400">Don't have an account? </span>
              <Link href="/en/auth/register" className="text-blue-400 hover:text-cyan-400 transition-colors">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="text-slate-400">Already have an account? </span>
              <Link href="/en/auth/login" className="text-blue-400 hover:text-cyan-400 transition-colors">
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
