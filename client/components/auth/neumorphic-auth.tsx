"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

interface NeumorphicAuthProps {
  initialMode?: "login" | "register";
}

export function NeumorphicAuth({ initialMode = "login" }: NeumorphicAuthProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isRegister = mode === "register";

  // Password strength logic for register mode
  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-slate-300", score: 0 };
    if (password.length < 6)
      return { label: "Weak", color: "bg-rose-500", score: 1 };
    if (password.length < 10)
      return { label: "Medium", color: "bg-amber-500", score: 2 };
    return { label: "Strong", color: "bg-emerald-600", score: 3 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && !agreeTerms) {
      alert("Please agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(
        isRegister
          ? `Account created for ${name} (${email})!`
          : `Signed in as ${email}!`
      );
    }, 900);
  };

  return (
    <div className="min-h-screen w-full neu-bg flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans select-none">
      <div className="w-full max-w-md">
        {/* Main Neumorphic Card */}
        <div className="neu-card rounded-[32px] p-6 sm:p-8 md:p-10 transition-all duration-500 ease-in-out">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-full neu-btn mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-white shadow-xs">
                <Zap className="h-5 w-5 fill-white text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              webBriks
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1.5 max-w-xs transition-all duration-300">
              {isRegister
                ? "Start managing your agile projects & sprints in seconds."
                : "Welcome back! Access your Kanban board & project backlog."}
            </p>
          </div>

          {/* Animated Toggle Pills */}
          <div className="flex items-center rounded-2xl neu-pill-active p-1.5 mb-7 relative">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-xs font-semibold transition-all duration-300 rounded-xl cursor-pointer ${
                !isRegister
                  ? "text-emerald-900 neu-btn bg-[#eef2f6] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2 text-xs font-semibold transition-all duration-300 rounded-xl cursor-pointer ${
                isRegister
                  ? "text-emerald-900 neu-btn bg-[#eef2f6] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field with Expand/Collapse Animation */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isRegister
                  ? "max-h-24 opacity-100 space-y-1.5 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required={isRegister}
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full neu-input rounded-2xl py-3.5 pl-11 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-1">
                {isRegister ? "Work Email" : "Email Address"}
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="alex@timetoprogram.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full neu-input rounded-2xl py-3.5 pl-11 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                {!isRegister && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset instructions sent.");
                    }}
                    className="text-[11px] font-semibold text-emerald-800 hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full neu-input rounded-2xl py-3.5 pl-11 pr-11 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password strength meter (shown in Register mode) */}
              {isRegister && password && (
                <div className="flex items-center gap-2 px-1 pt-1 transition-all duration-300">
                  <div className="flex-1 h-1.5 neu-pill-active rounded-full overflow-hidden flex gap-1 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength.score >= 1 ? strength.color : "bg-transparent"
                      }`}
                      style={{ width: "33%" }}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength.score >= 2 ? strength.color : "bg-transparent"
                      }`}
                      style={{ width: "33%" }}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        strength.score >= 3 ? strength.color : "bg-transparent"
                      }`}
                      style={{ width: "33%" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Checkbox Options: Remember Me vs Terms */}
            {!isRegister ? (
              <div className="flex items-center gap-2.5 px-1 py-1">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`flex h-5 w-5 items-center justify-center rounded-lg transition-all ${
                    rememberMe ? "neu-pill-active text-emerald-800" : "neu-btn"
                  }`}
                >
                  {rememberMe && <span className="h-2 w-2 rounded-sm bg-emerald-800" />}
                </button>
                <span
                  onClick={() => setRememberMe(!rememberMe)}
                  className="text-xs font-medium text-slate-600 cursor-pointer select-none"
                >
                  Keep me signed in for 30 days
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 px-1 py-1.5">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg transition-all ${
                    agreeTerms ? "neu-pill-active text-emerald-800" : "neu-btn"
                  }`}
                >
                  {agreeTerms && <span className="h-2 w-2 rounded-sm bg-emerald-800" />}
                </button>
                <span
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className="text-xs font-normal text-slate-600 cursor-pointer select-none leading-tight"
                >
                  I agree to the{" "}
                  <a href="#" className="font-semibold text-emerald-800 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-emerald-800 hover:underline">
                    Privacy Policy
                  </a>.
                </span>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full neu-btn-primary rounded-2xl py-3.5 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>
                {isLoading
                  ? isRegister
                    ? "Creating Account..."
                    : "Signing in..."
                  : isRegister
                  ? "Create webBriks Account"
                  : "Sign In to webBriks"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Social Dividers */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-slate-300/60" />
            <span className="absolute neu-bg px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isRegister ? "Or register with" : "Or continue with"}
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert("Google auth simulated")}
              className="neu-btn rounded-2xl py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => alert("GitHub auth simulated")}
              className="neu-btn rounded-2xl py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <svg className="h-4 w-4 fill-slate-800" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Bottom Link Switcher */}
          <div className="mt-7 text-center text-xs font-medium text-slate-500">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Create free account
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer copyright */}
        <p className="mt-6 text-center text-[11px] text-slate-400">
          &copy; {new Date().getFullYear()} webBriks SaaS. Soft Neumorphism UI.
        </p>
      </div>
    </div>
  );
}
