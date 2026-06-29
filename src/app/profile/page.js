"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  BookOpen,
  GraduationCap,
  Coins,
  Sparkles,
  Check,
  AlertCircle,
  Heart,
  Flame,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ChatDrawer from "@/components/ChatDrawer";

const LIFESTYLE_HABITS = [
  "Quiet Study",
  "Early Bird",
  "Night Owl",
  "Cooking Lover",
  "No Smoking",
  "Pet Friendly",
  "Socializer",
  "Clean Freak",
];

export default function ProfilePage() {
  const router = useRouter();
  const {
    currentUser,
    updateUserProfile,
    setShowAuthModal,
    setAuthTab,
    favorites,
    matchesList,
  } = useApp();

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileDept, setProfileDept] = useState("Computer Science");
  const [profileLevel, setProfileLevel] = useState("100L");
  const [profileBudget, setProfileBudget] = useState("250000");
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Sync state with current user session values
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || "");
      setProfileEmail(currentUser.email || "");
      setProfileDept(currentUser.department || "Computer Science");
      setProfileLevel(currentUser.yearOfStudy || "100L");
      setProfileBudget(currentUser.budget || "250000");
      setSelectedHabits(currentUser.habits || ["Quiet Study", "Early Bird"]);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 flex flex-col justify-center items-center gap-6 text-center select-none">
          <div className="h-16 w-16 bg-purple-50 text-purple-650 rounded-2xl flex items-center justify-center animate-bounce">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              Access Denied
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-sm leading-relaxed">
              You must be logged in as a student to create and manage your
              roommate matching preferences profile.
            </p>
          </div>
          <button
            onClick={() => {
              setAuthTab("login");
              setShowAuthModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-md transition"
          >
            Sign In / Register
          </button>
        </main>
        <AuthModal />
        <ChatDrawer />
        <Footer />
      </div>
    );
  }

  if (currentUser.role === "agent") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 flex flex-col justify-center items-center gap-6 text-center select-none">
          <div className="h-16 w-16 bg-purple-50 text-purple-650 rounded-2xl flex items-center justify-center">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              Agent Account Profile
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-sm leading-relaxed">
              Verified Housing Agents do not require roommate matchmaking. Head
              to the Agent Dashboard to manage listings.
            </p>
          </div>
          <button
            onClick={() => router.push("/agent/dashboard")}
            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-md transition"
          >
            Go to Agent Dashboard
          </button>
        </main>
        <AuthModal />
        <ChatDrawer />
        <Footer />
      </div>
    );
  }

  const toggleHabit = (habit) => {
    setSelectedHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit],
    );
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName.trim(),
      department: profileDept,
      yearOfStudy: profileLevel,
      budget: profileBudget,
      habits: selectedHabits,
    });

    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col pb-20 md:pb-0 selection:bg-purple-100 selection:text-purple-900">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full text-left">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start animate-slide-up select-none">
          {/* Left Column: Stats & Summary Card */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-purple-600" />

              {/* Avatar circle */}
              <div className="relative h-24 w-24 mx-auto rounded-full border-4 border-purple-50/70 shadow-sm overflow-hidden flex items-center justify-center bg-purple-50">
                <User className="h-12 w-12 text-purple-650" />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-800">
                  {currentUser.name}
                </h2>
                <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 mt-1">
                  Verified Student
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-left space-y-3 font-semibold text-slate-600 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span>{profileDept}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  <span>Level: {profileLevel}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center">
                <Heart className="h-5 w-5 text-red-500 mb-1" />
                <span className="block text-xl font-black text-slate-800">
                  {favorites.size}
                </span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  Saved Hostels
                </span>
              </div>
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center">
                <Flame className="h-5 w-5 text-amber-500 mb-1 animate-pulse" />
                <span className="block text-xl font-black text-slate-800">
                  {matchesList.length}
                </span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  Matches
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Preferences Edit Form */}
          <div className="flex-1 w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md relative">
            {showSuccessAlert && (
              <div className="absolute top-6 right-6 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-slide-up shadow-sm">
                <Check className="h-4 w-4 stroke-3" />
                <span>Preferences updated successfully!</span>
              </div>
            )}

            <div className="border-b border-slate-100 pb-4 mb-6">
              <h1 className="text-xl sm:text-2xl font-black text-slate-905 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" /> Roommate
                Preferences
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Configure your lifestyle habits and budget. This profile will be
                visible in the Roommates swiper deck.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Details Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profileEmail}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none text-slate-450 font-semibold mt-1.5 cursor-not-allowed"
                  />
                </div>

                {/* Faculty/Department */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Faculty / Department
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science / Chemistry"
                    value={profileDept}
                    onChange={(e) => setProfileDept(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
                  />
                </div>

                {/* Academic Year */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Academic Level
                  </label>
                  <select
                    value={profileLevel}
                    onChange={(e) => setProfileLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs outline-none text-slate-700 font-semibold cursor-pointer mt-1.5"
                  >
                    <option value="100L">100L (Freshman)</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="500L">500L (Finalist)</option>
                    <option value="PG">Postgraduate</option>
                  </select>
                </div>
              </div>

              {/* Budget Slider */}
              <div className="space-y-2 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-baseline">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Target Annual Budget Limit
                  </label>
                  <span className="text-sm font-black text-purple-650">
                    ₦{Number(profileBudget).toLocaleString()}/year
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="600000"
                  step="10000"
                  value={profileBudget}
                  onChange={(e) => setProfileBudget(e.target.value)}
                  className="w-full accent-purple-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold uppercase tracking-wide">
                  <span>₦100k</span>
                  <span>₦350k</span>
                  <span>₦600k</span>
                </div>
              </div>

              {/* Habits Toggles */}
              <div className="space-y-3 border-t border-slate-100 pt-6 text-left">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                  Lifestyle habits & preferences
                </label>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {LIFESTYLE_HABITS.map((habit) => {
                    const isSelected = selectedHabits.includes(habit);
                    return (
                      <button
                        key={habit}
                        type="button"
                        onClick={() => toggleHabit(habit)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition duration-150 active:scale-95 flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-purple-55 border-purple-200 text-purple-750 shadow-sm shadow-purple-650/5"
                            : "bg-slate-50 border-slate-200/80 text-slate-550 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                        )}
                        {habit}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold py-3.5 px-8 rounded-xl text-xs shadow-md transition"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <AuthModal />
      <ChatDrawer />
      <Footer />
    </div>
  );
}
