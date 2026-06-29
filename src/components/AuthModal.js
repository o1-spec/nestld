"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Compass, Users, Building, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import AgentRegisterForm from "./AgentRegisterForm";

export default function AuthModal() {
  const router = useRouter();
  const {
    showAuthModal,
    setShowAuthModal,
    authTab,
    setAuthTab,
    setCurrentUser
  } = useApp();

  const [authRole, setAuthRole] = useState("student");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  if (!showAuthModal) return null;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    if (authTab === "login") {
      if (!authEmail.trim() || !authPassword.trim()) {
        setAuthError("Please fill out all fields.");
        return;
      }

      const isOlamide = authEmail.toLowerCase().includes("olamide") || authEmail.toLowerCase().includes("agent");
      const mockUser = {
        name: isOlamide ? "Prince Olamide" : authEmail.split("@")[0],
        email: authEmail,
        role: isOlamide ? "agent" : "student"
      };

      setCurrentUser(mockUser);
      setShowAuthModal(false);
      
      if (mockUser.role === "agent") {
        router.push("/agent/dashboard");
      } else {
        router.push("/");
      }
    } else {
      // General Student Registration
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
        setAuthError("Please fill out all fields.");
        return;
      }

      const mockUser = {
        name: authName,
        email: authEmail,
        role: "student"
      };

      setCurrentUser(mockUser);
      setShowAuthModal(false);
      router.push("/");
    }

    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
  };

  const quickLogin = (role) => {
    setAuthError("");
    if (role === "student") {
      setCurrentUser({
        name: "Tobi Daniel",
        email: "tobi.student@lasu.edu.ng",
        role: "student"
      });
      router.push("/");
    } else {
      setCurrentUser({
        name: "Prince Olamide",
        email: "olamide.agent@gmail.com",
        role: "agent"
      });
      router.push("/agent/dashboard");
    }
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-105 w-full max-w-md overflow-hidden relative animate-scale-up select-none text-left flex flex-col max-h-[95vh]">
        
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-550 h-8 w-8 rounded-full flex items-center justify-center transition active:scale-90 z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Top Banner */}
        <div className="bg-purple-650 p-6 text-white flex-shrink-0">
          <Compass className="h-8 w-8 mb-2 animate-bounce" />
          <h3 className="text-2xl font-black">LASU Accommodate</h3>
          <p className="text-xs text-purple-200 font-semibold mt-1">
            Hostels, flatsharing, and roommate matching around Ojo.
          </p>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-100 flex-shrink-0">
          <button
            onClick={() => { setAuthTab("login"); setAuthError(""); }}
            className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition ${
              authTab === "login"
                ? "text-purple-650 border-b-2 border-purple-600"
                : "text-slate-450 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthTab("register"); setAuthError(""); }}
            className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition ${
              authTab === "register"
                ? "text-purple-650 border-b-2 border-purple-600"
                : "text-slate-455 hover:text-slate-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Register Role Toggles */}
          {authTab === "register" && (
            <div className="space-y-2 mb-4">
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                Choose Your Account Role
              </span>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthRole("student")}
                  className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer select-none transition ${
                    authRole === "student"
                      ? "border-purple-650 bg-purple-50/50 text-purple-700 font-bold"
                      : "border-slate-200 hover:border-slate-305 text-slate-650"
                  }`}
                >
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    I am a Student
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthRole("agent")}
                  className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer select-none transition ${
                    authRole === "agent"
                      ? "border-purple-655 bg-purple-50/50 text-purple-700 font-bold"
                      : "border-slate-200 hover:border-slate-305 text-slate-650"
                  }`}
                >
                  <Building className="h-5 w-5 mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    I am an Agent
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Login Mode */}
          {authTab === "login" ? (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-105 text-red-650 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition mt-4"
              >
                Sign In
              </button>
            </form>
          ) : authRole === "student" ? (
            /* Student Register Mode */
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-105 text-red-650 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-650 hover:bg-purple-750 text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition mt-4"
              >
                Create Student Account
              </button>
            </form>
          ) : (
            /* Unified Agent Register Mode (renders AgentRegisterForm in compact view) */
            <div className="pr-1">
              <AgentRegisterForm
                onSuccess={() => setShowAuthModal(false)}
                onToggleLogin={() => setAuthTab("login")}
              />
            </div>
          )}

          {/* Quick login demo accounts section (Rendered below form ONLY if not in Agent registration mode) */}
          {(authTab === "login" || authRole === "student") && (
            <div className="pt-4 border-t border-slate-100 text-center space-y-2 mt-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Quick Demo Accounts
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold">
                <button
                  type="button"
                  onClick={() => quickLogin("student")}
                  className="py-2 border border-slate-200 hover:border-purple-200 hover:bg-purple-50/30 rounded-xl text-slate-600 transition"
                >
                  🔑 Student Profile
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin("agent")}
                  className="py-2 border border-slate-200 hover:border-purple-200 hover:bg-purple-50/30 rounded-xl text-slate-600 transition"
                >
                  🔑 Agent Profile
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
