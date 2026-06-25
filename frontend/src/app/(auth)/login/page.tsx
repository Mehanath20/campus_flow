"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Briefcase, ShieldAlert, GraduationCap, Eye, EyeOff, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "student", label: "Student", icon: GraduationCap, route: "/dashboard" },
  { id: "teacher", label: "Teacher", icon: Briefcase, route: "/teacher" },
  { id: "admin",   label: "Admin",   icon: ShieldAlert, route: "/dashboard" },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedRole = ROLES.find((r) => r.id === role)!;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name.trim() || email.split("@")[0] || "User");
    localStorage.setItem("userEmail", email.trim().toLowerCase());
    router.push(selectedRole.route);
  };

  return (
    <div className="glass-card p-8 w-full" style={{ borderRadius: "28px" }}>
      {/* Logo + Title */}
      <div className="text-center mb-7">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 animate-float"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-black gradient-text">Welcome to CampusFlow</h1>
        <p className="text-sm mt-1" style={{ color: "#7c6fa0" }}>AI-Powered Academic Management Platform</p>
      </div>

      {/* Role Selector */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-center mb-3" style={{ color: "#7c6fa0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          I am signing in as…
        </p>
        <div className="grid grid-cols-3 gap-3">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button key={r.id} type="button" onClick={() => setRole(r.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl text-sm font-semibold transition-all duration-250",
                  isSelected ? "glass-card-active text-violet-700 scale-[1.04]" : "text-violet-400 hover:scale-[1.02]"
                )}
                style={!isSelected ? {
                  background: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(167,139,250,0.2)",
                } : undefined}
              >
                <Icon className={cn("w-5 h-5", isSelected ? "text-violet-600" : "text-violet-400")} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-3.5">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#a78bfa" }} />
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="glass-input w-full h-12 pl-10 pr-4 rounded-2xl text-sm"
            style={{ color: "#2d2b55" }}
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#a78bfa" }} />
          <input
            type="email"
            placeholder="your@college.edu"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="glass-input w-full h-12 pl-10 pr-4 rounded-2xl text-sm"
            style={{ color: "#2d2b55" }}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#a78bfa" }} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="glass-input w-full h-12 pl-10 pr-12 rounded-2xl text-sm"
            style={{ color: "#2d2b55" }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "#a78bfa" }}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button type="submit" disabled={loading}
          className="glass-btn w-full h-12 rounded-2xl text-base mt-1 flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>Sign In as {selectedRole.label}</>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="flex items-center justify-center gap-6 mt-5 text-sm">
        <Link href="/register" className="font-medium transition-colors hover:text-violet-600" style={{ color: "#a78bfa", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          Create an Account
        </Link>
        <Link href="#" className="font-medium transition-colors hover:text-violet-600" style={{ color: "#a78bfa", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
