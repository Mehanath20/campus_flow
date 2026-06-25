"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, BookOpen, Calendar, Settings, LogOut, CheckSquare,
  Briefcase, Sparkles, BrainCircuit, PieChart, Bell, GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getRole, getUserName } from "@/lib/store";

const teacherNav = [
  { href: "/teacher", label: "Dashboard", icon: Home, color: "text-indigo-500" },
  { href: "/teacher/assignments", label: "Assignments", icon: CheckSquare, color: "text-blue-500" },
  { href: "/teacher/materials", label: "Course Materials", icon: BookOpen, color: "text-purple-500" },
  { href: "/teacher/notices", label: "Notices & Alerts", icon: Bell, color: "text-amber-500" },
  { href: "/teacher/attendance", label: "Attendance", icon: PieChart, color: "text-rose-500" },
  { href: "/teacher/placements", label: "Placements", icon: Briefcase, color: "text-teal-500" },
];

const studentNav = [
  { href: "/dashboard", label: "Dashboard", icon: Home, color: "text-indigo-500" },
  { href: "/dashboard/assignments", label: "My Assignments", icon: CheckSquare, color: "text-blue-500" },
  { href: "/dashboard/materials", label: "Study Materials", icon: BookOpen, color: "text-purple-500" },
  { href: "/dashboard/notices", label: "Notices", icon: Bell, color: "text-amber-500" },
  { href: "/study-buddy", label: "AI Study Buddy", icon: Sparkles, color: "text-yellow-500" },
  { href: "/dashboard/attendance", label: "My Attendance", icon: PieChart, color: "text-rose-500" },
  { href: "/dashboard/placement", label: "Placement Prep AI", icon: Briefcase, color: "text-rose-500" },
  { href: "/dashboard/analytics", label: "Analytics", icon: PieChart, color: "text-fuchsia-500" },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar, color: "text-green-500" },
];

export function Sidebar({ className }: { className?: string }) {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("User");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setRole(getRole());
    setName(getUserName());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const navItems = role === "teacher" ? teacherNav : studentNav;
  const roleLabel = role === "teacher" ? "Faculty Portal" : "Student Portal";
  const roleColor = role === "teacher" ? "from-emerald-600 to-teal-600" : "from-indigo-600 to-purple-600";

  return (
    <div className={cn("pb-12 border-r bg-white min-h-screen flex flex-col", className)}>
      {/* Brand */}
      <div className="px-6 py-5 border-b">
        <h2 className={cn("text-xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent", roleColor)}>
          CampusFlow 3.0
        </h2>
        <span className="text-xs text-slate-400 font-medium">{roleLabel}</span>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <span className={cn(
                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-all duration-150",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}>
                <Icon className={cn("mr-3 h-4 w-4 shrink-0", isActive ? "text-indigo-600" : item.color)} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br", roleColor)}>
            {name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
            <p className="text-xs text-slate-400 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
