"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";

interface NeumorphicAuthProps {
  initialMode?: "login" | "register";
}

export function NeumorphicAuth({ initialMode = "login" }: NeumorphicAuthProps) {
  const router = useRouter();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isRegister = mode === "register";

  const handleModeSwitch = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrorMessage(null);
    if (newMode === "login") {
      router.push("/login");
    } else {
      router.push("/register");
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-slate-300", score: 0 };
    if (password.length < 6)
      return { label: "Weak", color: "bg-rose-500", score: 1 };
    if (password.length < 10)
      return { label: "Medium", color: "bg-amber-500", score: 2 };
    return { label: "Strong", color: "bg-emerald-600", score: 3 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (isRegister) {
      if (!name || name.trim().length < 2) {
        setErrorMessage("Name must be at least 2 characters long.");
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      if (!agreeTerms) {
        setErrorMessage("You must agree to the Terms of Service.");
        return;
      }

      try {
        setIsLoading(true);
        await register({ name: name.trim(), email: email.trim(), password });
        toast.success("Registration successful! Please sign in.");
        setMode("login");
        setErrorMessage(null);
        setPassword("");
        setConfirmPassword("");
        router.push("/login");
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
        } else if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!password) {
        setErrorMessage("Please enter your password.");
        return;
      }

      try {
        setIsLoading(true);
        await login({ email: email.trim(), password });
        toast.success("Welcome back!");
        router.push("/");
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
        } else if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("Invalid credentials. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full neu-bg flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans select-none">
      <div className="w-full max-w-md">
        {/* Main Neumorphic Card */}
        <div className="neu-card rounded-[32px] p-6 sm:p-8 md:p-10 transition-all duration-500 ease-in-out">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full neu-btn mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-white shadow-xs">
                <Zap className="h-5 w-5 fill-white text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              webBriks
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 max-w-xs transition-all duration-300">
              {isRegister
                ? "Start managing your agile projects & sprints in seconds."
                : "Welcome back! Access your Kanban board & project backlog."}
            </p>
          </div>

          {/* Animated Toggle Pills */}
          <div className="flex items-center rounded-2xl neu-pill-active p-1.5 mb-6 relative">
            <button
              type="button"
              onClick={() => handleModeSwitch("login")}
              className={`flex-1 py-2 text-xs font-semibold transition-all duration-300 rounded-xl cursor-pointer ${
                !isRegister
                  ? "text-emerald-900 dark:text-emerald-300 neu-btn bg-[#eef2f6] dark:bg-slate-800 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch("register")}
              className={`flex-1 py-2 text-xs font-semibold transition-all duration-300 rounded-xl cursor-pointer ${
                isRegister
                  ? "text-emerald-900 dark:text-emerald-300 neu-btn bg-[#eef2f6] dark:bg-slate-800 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Feedback Banner */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 p-3.5 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field (Register Mode) */}
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-1">
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
                    className="w-full neu-input rounded-2xl py-3.5 pl-11 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-1">
                {isRegister ? "Work Email" : "Email Address"}
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full neu-input rounded-2xl py-3.5 pl-11 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full neu-input rounded-2xl py-3.5 pl-11 pr-11 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password strength meter (Register Mode) */}
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
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password (Register Mode) */}
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 h-4 w-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full neu-input rounded-2xl py-3.5 pl-11 pr-11 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

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
                  className="text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none"
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
                  className="text-xs font-normal text-slate-600 dark:text-slate-300 cursor-pointer select-none leading-tight"
                >
                  I agree to the{" "}
                  <a href="#" className="font-semibold text-emerald-800 dark:text-emerald-400 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-emerald-800 dark:text-emerald-400 hover:underline">
                    Privacy Policy
                  </a>.
                </span>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full neu-btn-primary rounded-2xl py-3.5 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

          {/* Bottom Link Switcher */}
          <div className="mt-7 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleModeSwitch("login")}
                  className="font-bold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleModeSwitch("register")}
                  className="font-bold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Create free account
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer copyright */}
        <p className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} webBriks SaaS. Soft Neumorphism UI.
        </p>
      </div>
    </div>
  );
}
