"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Heart, User, Building } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { currentUser, favorites } = useApp();

  const isAgent = currentUser && currentUser.role === "agent";

  const tabs = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      id: "matches",
      label: "Matches",
      href: "/roommates",
      icon: Users,
      isActive: pathname === "/roommates",
    },
    {
      id: "listings",
      label: isAgent ? "Portal" : "Saved",
      href: isAgent ? "/agent/dashboard" : "/favorites",
      icon: isAgent ? Building : Heart,
      isActive: isAgent
        ? pathname.startsWith("/agent")
        : pathname === "/favorites",
      badgeCount: isAgent ? 0 : favorites?.size || 0,
    },
    {
      id: "profile",
      label: "Profile",
      href: isAgent ? "/agent/dashboard" : "/profile",
      icon: User,
      isActive: isAgent ? false : pathname === "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-4 py-2 pb-5 md:hidden flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        if (tab.isActive) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex items-center gap-1.5 bg-purple-600 text-white rounded-full px-4.5 py-2.5 text-xs font-black shadow-md shadow-purple-600/10 animate-scale-up transition-all duration-200 shrink-0"
            >
              <Icon className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>{tab.label}</span>
            </Link>
          );
        } else {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-0.5 text-slate-500 hover:text-slate-800 transition py-1 px-3 shrink-0 relative"
            >
              <Icon className="h-5 w-5 stroke-2" />
              <span className="text-[9px] font-extrabold uppercase tracking-wide">
                {tab.label}
              </span>
              {tab.badgeCount > 0 && (
                <span className="absolute top-0 right-2 bg-red-500 text-white rounded-full text-[8px] w-4 h-4 flex items-center justify-center font-bold">
                  {tab.badgeCount}
                </span>
              )}
            </Link>
          );
        }
      })}
    </div>
  );
}
