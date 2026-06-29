"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Users, Heart, X, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ChatDrawer from "@/components/ChatDrawer";

const ROOMMATES_DECK = [
  {
    id: "mate-1",
    name: "Adebayo Temitope",
    age: 21,
    gender: "Male",
    department: "Mechanical Engineering",
    yearOfStudy: "300L",
    budget: 200000,
    bio: "Hey there! Looking for a neat roommate to split a self-contained room near Iyana-Iba or LASU Road. I'm highly focused, clean up after myself, and mostly stay up coding or reading. Respectful of private space.",
    habits: { cleanliness: 5, noise: 2, sleep: "Night-owl", smoke: false },
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: "mate-2",
    name: "Chioma Nwachukwu",
    age: 20,
    gender: "Female",
    department: "Law Faculty",
    yearOfStudy: "200L",
    budget: 250000,
    bio: "Law student here! Looking for a friendly, respectful female student to share a flat with. I enjoy cooking, music, and quiet study sessions. Very neat and organized.",
    habits: { cleanliness: 4, noise: 3, sleep: "Early-bird", smoke: false },
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: "mate-3",
    name: "Olamide Benson",
    age: 22,
    gender: "Male",
    department: "Computer Science",
    yearOfStudy: "400L",
    budget: 180000,
    bio: "Finalist CS student looking for a calm roommate. I spend most of my day at labs or on my laptop. Love peace and quiet. Let's team up to secure an affordable place around PPL axis.",
    habits: { cleanliness: 4, noise: 1, sleep: "Night-owl", smoke: false },
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: "mate-4",
    name: "Fatima Bello",
    age: 18,
    gender: "Female",
    department: "Economics",
    yearOfStudy: "100L",
    budget: 300000,
    bio: "Freshman student looking for a roommate. I am outgoing, love making friends, and hosting study groups. I'm looking for a self-contain or flatmate around Main Gate area to share the bills.",
    habits: { cleanliness: 3, noise: 4, sleep: "Night-owl", smoke: false },
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
  },
];

export default function RoommateFinderPage() {
  const {
    matchesList,
    setMatchesList,
    currentSwipeIndex,
    setCurrentSwipeIndex,
    showMatchCelebration,
    setShowMatchCelebration,
    setActiveChat,
    setChatMessages,
  } = useApp();

  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleSwipe = (direction) => {
    if (currentSwipeIndex >= ROOMMATES_DECK.length) return;

    const mate = ROOMMATES_DECK[currentSwipeIndex];

    if (direction === "like") {
      // Simulate 70% chance of a mutual match
      if (Math.random() > 0.3) {
        setTimeout(() => {
          setShowMatchCelebration(mate);
          setMatchesList((prev) => [...prev, mate]);
          setChatMessages((prev) => ({
            ...prev,
            [mate.id]: [
              {
                id: `system-match-${Date.now()}`,
                senderId: "system",
                content: `You matched with ${mate.name}!`,
                timestamp: new Date(),
              },
              {
                id: `mate-msg-${Date.now()}`,
                senderId: mate.id,
                content: `Hello! I saw we matched! I'm in ${mate.department} (${mate.yearOfStudy}). Do you want to team up and rent a hostel or check out some properties around Ojo together?`,
                timestamp: new Date(),
              },
            ],
          }));
        }, 500);
      }
    }

    setSwipeOffset({ x: direction === "like" ? 400 : -400, y: 0 });
    setTimeout(() => {
      setCurrentSwipeIndex((prev) => prev + 1);
      setSwipeOffset({ x: 0, y: 0 });
    }, 200);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setSwipeOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (swipeOffset.x > 140) {
      handleSwipe("like");
    } else if (swipeOffset.x < -140) {
      handleSwipe("dislike");
    } else {
      setSwipeOffset({ x: 0, y: 0 });
    }
  };

  const startRoommateChat = (mate) => {
    const chatPartner = {
      id: mate.id,
      name: mate.name,
      avatar: mate.avatar,
      role: `${mate.department} (${mate.yearOfStudy})`,
      listingTitle: "Roommate Match",
    };
    setActiveChat(chatPartner);
    setShowMatchCelebration(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col pb-20 md:pb-0 selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation Header */}
      <Header />

      {/* Main Roommate Deck Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 sm:gap-8 items-stretch select-none">
          {/* Swiper Deck Column */}
          <div className="flex-1 flex flex-col items-center gap-6 justify-center">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1 text-xs uppercase font-extrabold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                <Sparkles className="h-3 w-3 text-amber-500 fill-amber-400" />{" "}
                Roommate Matching
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-805 font-sans">
                Swipe to Connect
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-sm font-semibold">
                Swipe right to match and chat with potential flatmates looking
                for accommodation around Ojo.
              </p>
            </div>

            <div className="relative w-full max-w-[320px] sm:max-w-[340px] h-[430px] sm:h-[460px] flex items-center justify-center">
              {currentSwipeIndex < ROOMMATES_DECK.length ? (
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  style={{
                    transform: `translate(${swipeOffset.x}px, ${swipeOffset.y}px) rotate(${swipeOffset.x / 12}deg)`,
                    transition: isDragging
                      ? "none"
                      : "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                  className="absolute w-full h-full bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing flex flex-col justify-between touch-none"
                >
                  <div className="relative flex-1 bg-slate-100 overflow-hidden">
                    <img
                      src={ROOMMATES_DECK[currentSwipeIndex].avatar}
                      alt={ROOMMATES_DECK[currentSwipeIndex].name}
                      className="w-full h-full object-cover object-center pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold px-3 py-1 rounded-full text-[10px] sm:text-xs shadow-md">
                      Budget: ₦
                      {(
                        ROOMMATES_DECK[currentSwipeIndex].budget / 1000
                      ).toFixed(0)}
                      k/yr
                    </span>
                    {swipeOffset.x > 30 && (
                      <div className="absolute top-16 left-6 border-4 border-emerald-500 text-emerald-500 uppercase font-black px-3 py-1 rounded-md text-xl transform -rotate-12">
                        LIKE
                      </div>
                    )}
                    {swipeOffset.x < -30 && (
                      <div className="absolute top-16 right-6 border-4 border-red-500 text-red-500 uppercase font-black px-3 py-1 rounded-md text-xl transform rotate-12">
                        NOPE
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                      <h3 className="font-extrabold text-lg sm:text-xl">
                        {ROOMMATES_DECK[currentSwipeIndex].name},{" "}
                        {ROOMMATES_DECK[currentSwipeIndex].age}
                      </h3>
                      <p className="text-xs text-slate-300 font-semibold">
                        {ROOMMATES_DECK[currentSwipeIndex].department} (
                        {ROOMMATES_DECK[currentSwipeIndex].yearOfStudy})
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-white text-left space-y-4 border-t border-slate-100 shrink-0">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-3">
                      &ldquo;{ROOMMATES_DECK[currentSwipeIndex].bio}&rdquo;
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-extrabold text-slate-555">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-purple-650 rounded-full"></span>
                        <span>
                          Cleanliness:{" "}
                          {ROOMMATES_DECK[currentSwipeIndex].habits.cleanliness}
                          /5
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-purple-650 rounded-full"></span>
                        <span>
                          Sleep:{" "}
                          {ROOMMATES_DECK[currentSwipeIndex].habits.sleep}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-purple-650 rounded-full"></span>
                        <span>
                          Noise:{" "}
                          {ROOMMATES_DECK[currentSwipeIndex].habits.noise}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-purple-650 rounded-full"></span>
                        <span>
                          Smoke/Drink:{" "}
                          {ROOMMATES_DECK[currentSwipeIndex].habits.smoke
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-white border rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-4">
                  <Sparkles className="h-8 w-8 text-purple-600 animate-bounce" />
                  <h3 className="font-extrabold text-slate-850">
                    End of the Deck
                  </h3>
                  <button
                    onClick={() => setCurrentSwipeIndex(0)}
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    Swipe Again
                  </button>
                </div>
              )}
            </div>

            {currentSwipeIndex < ROOMMATES_DECK.length && (
              <div className="flex items-center gap-6 pt-2">
                <button
                  onClick={() => handleSwipe("dislike")}
                  className="w-14 h-14 bg-white border border-slate-205 rounded-full flex items-center justify-center text-red-500 hover:text-red-650 shadow-md hover:shadow-lg transition"
                >
                  <X className="h-7 w-7 stroke-3" />
                </button>
                <button
                  onClick={() => handleSwipe("like")}
                  className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg transition hover:bg-purple-700"
                >
                  <Heart className="h-8 w-8 fill-current" />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar: Active Matches */}
          <div className="w-full md:w-80 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col gap-6 shadow-sm">
            <div className="text-left">
              <h3 className="font-extrabold text-lg text-slate-800">
                Your Matches
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Matched students looking to share
              </p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[200px] md:min-h-[250px] space-y-3">
              {matchesList.length > 0 ? (
                matchesList.map((mate) => (
                  <div
                    key={mate.id}
                    onClick={() => startRoommateChat(mate)}
                    className="p-3 bg-slate-50 hover:bg-purple-50 border border-slate-100 rounded-2xl flex items-center gap-3 cursor-pointer transition group"
                  >
                    <img
                      src={mate.avatar}
                      alt={mate.name}
                      className="w-12 h-12 rounded-full object-cover shadow-sm transition"
                    />
                    <div className="text-left flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-800 truncate group-hover:text-purple-600 transition">
                        {mate.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold truncate">
                        {mate.department} • ₦{(mate.budget / 1000).toFixed(0)}k
                      </p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                        <Check className="h-2.5 w-2.5 stroke-3" /> Mutual Match
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-3">
                  <Users className="h-10 w-10 text-slate-300" />
                  <p className="text-xs text-slate-400 font-bold max-w-[180px]">
                    No matches yet. Keep swiping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confetti Match Celebration Pop-up */}
      {showMatchCelebration && (
        <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-4 z-55 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm text-center space-y-6 relative border border-slate-100 animate-scale-up select-none">
            <div className="flex justify-center gap-4 relative">
              <Sparkles className="absolute top-[-20px] left-8 text-amber-400 h-6 w-6 animate-pulse" />
              <Sparkles className="absolute bottom-[-10px] right-8 text-purple-500 h-5 w-5 animate-pulse" />
              <div className="h-17 w-17 sm:h-20 sm:w-20 rounded-full border-4 border-purple-650 overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-17 w-17 sm:h-20 sm:w-20 rounded-full border-4 border-amber-400 overflow-hidden shadow-md">
                <img
                  src={showMatchCelebration.avatar}
                  alt={showMatchCelebration.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black bg-linear-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent leading-none">
                It&apos;s a Match!
              </h2>
              <p className="text-xs text-slate-500 font-bold">
                You and {showMatchCelebration.name} matched.
              </p>
            </div>
            <div className="bg-slate-50 border rounded-2xl p-4 text-left">
              <p className="text-xs text-slate-650 font-semibold italic">
                &ldquo;{showMatchCelebration.bio}&rdquo;
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => startRoommateChat(showMatchCelebration)}
                className="w-full bg-[#7C3AED] text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition"
              >
                Send a Message
              </button>
              <button
                onClick={() => setShowMatchCelebration(null)}
                className="w-full bg-slate-55 text-slate-650 font-bold py-3 rounded-xl text-xs border"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals & Chat Sliders */}
      <AuthModal />
      <ChatDrawer />

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}
