"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Compass,
  Users,
  Building,
  User,
  LogOut,
  MessageSquare,
  Heart
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentUser,
    setCurrentUser,
    logoutUser,
    setShowAuthModal,
    setAuthTab,
    matchesList,
    showInbox,
    setShowInbox,
    chatMessages,
    favorites
  } = useApp();

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  const handlePostClick = () => {
    if (!currentUser) {
      setAuthTab("login");
      setShowAuthModal(true);
      return;
    }

    if (currentUser.role !== "agent") {
      alert(
        "Access Denied: Only registered housing agents are authorized to upload accommodation listings. Students can match with roommates and chat with agents instead.",
      );
      return;
    }

    router.push("/agent/create-listing");
  };

  const handleAgentPortalTab = () => {
    if (currentUser && currentUser.role === "agent") {
      router.push("/agent/dashboard");
    } else {
      router.push("/agent/register");
    }
  };

  const activeChatsCount = Object.keys(chatMessages || {}).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/85 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Compass className="h-5 w-5 animate-pulse" />
          </div>
          <div className="text-left shrink-0">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-linear-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent whitespace-nowrap">
              Nestld
            </span>
            <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-amber-500 mt-[-2px] whitespace-nowrap">
              Ojo Student Housing
            </span>
          </div>
        </Link>

        {/* Navigation Items (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link
            href="/"
            className={`relative py-2 transition-all ${
              pathname === "/"
                ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600 after:rounded-full"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Properties
          </Link>

          {/* Show roommate finder to students/guests */}
          {(!currentUser || currentUser.role !== "agent") && (
            <Link
              href="/roommates"
              className={`relative py-2 transition-all flex items-center gap-2 ${
                pathname === "/roommates"
                  ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600 after:rounded-full"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="h-4 w-4" />
              Match Roommate
              {matchesList.length > 0 && (
                <span className="bg-red-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center animate-bounce">
                  {matchesList.length}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={handleAgentPortalTab}
            className={`relative py-2 transition-all flex items-center gap-1.5 ${
              pathname.startsWith("/agent")
                ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600 after:rounded-full"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Building className="h-4.5 w-4.5" />
            Agent Portal
          </button>
          <Link
            href="/help"
            className={`relative py-2 transition-all ${
              pathname === "/help"
                ? "text-purple-650 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-650 after:rounded-full"
                : "text-slate-505 hover:text-slate-900"
            }`}
          >
            Help
          </Link>
        </nav>

        {/* Auth Action Buttons */}
        <div className="flex items-center gap-3">
          
          {/* Saved / Favorites Shortcut */}
          <Link
            href="/favorites"
            className={`p-2.5 rounded-full border transition relative ${
              pathname === "/favorites"
                ? "bg-purple-55 text-purple-650 border-purple-200"
                : "border-slate-205 hover:bg-slate-50 text-slate-550 hover:text-slate-900"
            }`}
            title="Saved Properties"
          >
            <Heart className="h-4.5 w-4.5" />
            {favorites?.size > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                {favorites.size}
              </span>
            )}
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Inbox Trigger Button */}
              <button
                onClick={() => setShowInbox(!showInbox)}
                className={`p-2.5 rounded-full border transition relative ${
                  showInbox
                    ? "bg-purple-50 text-purple-600 border-purple-200"
                    : "border-slate-205 hover:bg-slate-50 text-slate-550 hover:text-slate-900"
                }`}
                title="Inbox / Chats"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                {activeChatsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                    {activeChatsCount}
                  </span>
                )}
              </button>

              <Link
                href={currentUser.role === "agent" ? "/agent/dashboard" : "/profile"}
                className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 hover:border-purple-300 hover:bg-purple-50/20 transition cursor-pointer"
                title="My Profile Dashboard"
              >
                <User className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-extrabold text-slate-705 max-w-[120px] truncate">
                  {currentUser.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-full border border-slate-200 hover:bg-red-50 hover:text-red-500 text-slate-550 transition"
                title="Logout"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthTab("login");
                setShowAuthModal(true);
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold transition"
            >
              Login
            </button>
          )}

          {/* Post Listing Button (Hidden on mobile header) */}
          <button
            onClick={handlePostClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-750 active:scale-95 text-white text-sm font-semibold shadow-md shadow-purple-600/10 hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-200"
          >
            Post Property
          </button>
        </div>
      </div>
    </header>
  );
}
