"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserName, getRole, getNotices } from "@/lib/store";
import { useRouter } from "next/navigation";

export function Header() {
  const [name, setName] = useState("User");
  const [role, setRole] = useState("student");
  const [hasNotice, setHasNotice] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setName(getUserName());
    setRole(getRole());
    setHasNotice(getNotices().length > 0);
  }, []);

  const initial = name[0]?.toUpperCase() || "U";
  const isTeacher = role === "teacher";

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(167,139,250,0.18)",
        boxShadow: "0 2px 20px rgba(124,58,237,0.06)",
      }}>
      <div className="flex h-14 items-center px-6 gap-4">
        {/* Search */}
        <div className="relative flex-1 hidden md:block max-w-sm">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4" style={{ color: "#b09fd4" }} />
          <input
            type="search"
            placeholder={isTeacher ? "Search assignments, students..." : "Search materials, notices..."}
            className="glass-input w-full pl-10 pr-4 h-9 rounded-xl text-sm"
            style={{ color: "#2d2b55" }}
          />
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          {/* Bell */}
          <button className="relative h-9 w-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(167,139,250,0.2)", boxShadow: "0 2px 8px rgba(124,58,237,0.08)" }}>
            <Bell className="h-4 w-4" style={{ color: "#a78bfa" }} />
            {hasNotice && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-400 animate-pulse border-2 border-white" />
            )}
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-transform hover:scale-110"
            style={{
              background: isTeacher
                ? "linear-gradient(135deg,#059669,#34d399)"
                : "linear-gradient(135deg,#7c3aed,#a78bfa)",
              boxShadow: isTeacher ? "0 4px 12px rgba(5,150,105,0.3)" : "0 4px 12px rgba(124,58,237,0.3)"
            }}>
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
