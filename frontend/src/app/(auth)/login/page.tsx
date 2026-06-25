"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Briefcase, ShieldAlert, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    id: "student",
    label: "Student",
    description: "Access assignments, materials & AI buddy",
    icon: GraduationCap,
    color: "border-indigo-500 bg-indigo-50 text-indigo-700",
    ring: "ring-indigo-400",
  },
  {
    id: "teacher",
    label: "Teacher",
    description: "Create assignments, upload notes & manage class",
    icon: Briefcase,
    color: "border-emerald-500 bg-emerald-50 text-emerald-700",
    ring: "ring-emerald-400",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Full platform management & analytics",
    icon: ShieldAlert,
    color: "border-rose-500 bg-rose-50 text-rose-700",
    ring: "ring-rose-400",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name || email.split("@")[0] || "User");
    localStorage.setItem("userEmail", email);
    if (role === "teacher") {
      router.push("/teacher");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome to CampusFlow</h1>
        <p className="text-sm text-gray-500 mt-2">AI-Powered Academic Management Platform</p>
      </div>

      {/* Role Selection */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-3 text-center">I am signing in as…</p>
        <div className="grid grid-cols-3 gap-3">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-150 text-center",
                  isSelected ? r.color + " shadow-sm" : "border-gray-200 text-gray-500 hover:border-gray-300",
                  isSelected ? "ring-2 " + r.ring : ""
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-semibold">{r.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">
          {ROLES.find((r) => r.id === role)?.description}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 h-11 bg-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@college.edu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 bg-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 bg-white"
            />
          </div>
        </div>
        <Button
          type="submit"
          className={cn(
            "w-full h-11 text-base font-semibold transition-all shadow-md hover:shadow-lg mt-2",
            role === "teacher"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : role === "admin"
              ? "bg-rose-600 hover:bg-rose-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          Sign In as {ROLES.find((r) => r.id === role)?.label}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        New to CampusFlow?{" "}
        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Register here
        </Link>
      </p>
    </div>
  );
}
