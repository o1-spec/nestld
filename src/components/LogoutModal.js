"use client";

import React from "react";
import { LogOut, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function LogoutModal() {
  const router = useRouter();
  const { showLogoutModal, setShowLogoutModal, logoutUser } = useApp();

  if (!showLogoutModal) return null;

  const handleConfirmLogout = async () => {
    await logoutUser();
    setShowLogoutModal(false);
    router.push("/");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-55 animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 relative border border-slate-100 animate-scale-up select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowLogoutModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1 rounded-full hover:bg-slate-50"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <LogOut className="h-7 w-7" />
        </div>

        {/* Header Texts */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-850 font-sans">
            Confirm Log Out
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
            Are you sure you want to log out of your Nestld account? You will need to sign in again to access roommate matching, favorited hostels, and chat history.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="w-full sm:flex-1 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLogout}
            className="w-full sm:flex-1 py-3 bg-red-550 hover:bg-red-650 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-red-550/10 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
