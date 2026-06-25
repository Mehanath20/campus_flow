"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Home, BookOpen, Calendar, LogOut, CheckSquare,
  Briefcase, Sparkles, PieChart, Bell, LayoutDashboard,
  ChevronRight, Settings, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getRole, getUserName } from "@/lib/store";

const teacherNav = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher?tab=assignments", label: "Assignments", icon: CheckSquare },
  { href: "/teacher?tab=materials", label: "Course Materials", icon: BookOpen },
  { href: "/teacher?tab=notices", label: "Notices & Alerts", icon: Bell },
  { href: "/teacher/attendance", label: "Attendance", icon: PieChart },
  { href: "/teacher?tab=events", label: "Calendar", icon: Calendar },
];

const studentNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/assignments", label: "My Assignments", icon: CheckSquare },
  { href: "/dashboard/materials", label: "Study Materials", icon: BookOpen },
  { href: "/dashboard/notices", label: "Notices", icon: Bell },
  { href: "/study-buddy", label: "AI Study Buddy", icon: Sparkles },
  { href: "/dashboard/attendance", label: "My Attendance", icon: PieChart },
  { href: "/dashboard/placement", label: "Placement Prep AI", icon: Briefcase },
  { href: "/dashboard/analytics", label: "Analytics", icon: Zap },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
];

export function Sidebar({ className }: { className?: string }) {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("User");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setRole(getRole());
    setName(getUserName());
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const navItems = role === "teacher" ? teacherNav : studentNav;
  const isTeacher = role === "teacher";

  return (
    <div className={cn("pb-6 min-h-screen flex flex-col glass-sidebar", className)}>
      {/* Brand */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(167,139,250,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white animate-pulse-ring"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
            CF
          </div>
          <div>
            <h2 className="text-base font-black gradient-text">CampusFlow</h2>
            <span className="text-[10px] font-semibold" style={{ color: "#b09fd4" }}>
              {isTeacher ? "Faculty Portal" : "Student Portal"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-3 py-4 space-y-0.5">
        {mounted && navItems.map((item, idx) => {
          const Icon = item.icon;
          let isActive = pathname === item.href;
          if (item.href.includes("?tab=")) {
            const tab = item.href.split("?tab=")[1];
            isActive = pathname === "/teacher" && searchParams?.get("tab") === tab;
          } else if (item.href === "/teacher") {
            isActive = pathname === "/teacher" && !searchParams?.get("tab");
          }
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "glass-nav-item group flex items-center justify-between px-3 py-2.5 text-sm font-medium cursor-pointer",
                  "animate-slide-up",
                  isActive ? "glass-nav-active text-violet-700" : "text-slate-500 hover:text-violet-600"
                )}
                style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: "both" }}
              >
                <span className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-violet-600" : "text-slate-400 group-hover:text-violet-500"
                  )} />
                  {item.label}
                </span>
                {isActive && <ChevronRight className="w-3 h-3 text-violet-500" />}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3 h-px" style={{ background: "rgba(167,139,250,0.15)" }} />

      {/* Settings */}
      <div className="px-3 mb-2">
        <span className="glass-nav-item group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-violet-500 cursor-pointer">
          <Settings className="h-4 w-4 shrink-0 transition-colors group-hover:text-violet-500 group-hover:rotate-45 duration-300" />
          Settings
        </span>
      </div>

      {/* User Card */}
      <div className="px-3">
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{
              background: isTeacher
                ? "linear-gradient(135deg,#059669,#34d399)"
                : "linear-gradient(135deg,#7c3aed,#a78bfa)",
              boxShadow: isTeacher ? "0 4px 12px rgba(5,150,105,0.3)" : "0 4px 12px rgba(124,58,237,0.3)"
            }}>
            {name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: "#2d2b55" }}>{name}</p>
            <p className="text-xs capitalize" style={{ color: "#b09fd4" }}>{role}</p>
          </div>
          <button onClick={handleLogout}
            className="p-1.5 rounded-lg transition-all hover:bg-red-50 hover:scale-110 shrink-0"
            title="Logout">
            <LogOut className="h-3.5 w-3.5 text-slate-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
