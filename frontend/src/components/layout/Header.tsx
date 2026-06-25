"use client";

import { Bell, Search, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getUserName, getRole, getNotices } from "@/lib/store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const avatarGrad = role === "teacher" ? "from-emerald-500 to-teal-500" : "from-indigo-500 to-purple-500";

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-14 items-center px-6 gap-4">
        <div className="relative flex-1 hidden md:block max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder={role === "teacher" ? "Search assignments, students..." : "Search assignments, materials..."}
            className="pl-9 w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-indigo-400"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notification bell */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg hover:bg-slate-100">
            <Bell className="h-4 w-4 text-slate-500" />
            {hasNotice && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-8 w-8 border-2 border-slate-200 hover:border-indigo-400 transition-colors cursor-pointer">
                <AvatarFallback className={cn("bg-gradient-to-br text-white text-sm font-bold", avatarGrad)}>
                  {initial}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-slate-400 capitalize">{role} account</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
