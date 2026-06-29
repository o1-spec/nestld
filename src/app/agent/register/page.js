"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Zap, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import AgentRegisterForm from "@/components/AgentRegisterForm";

export default function AgentRegisterPage() {
  const router = useRouter();
  const { setShowAuthModal, setAuthTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col pb-20 md:pb-0 selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 sm:gap-12 items-start text-left select-none animate-slide-up">
          {/* Left Info Column */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Partner with the most trusted housing platform for{" "}
                <span className="text-purple-605">LASU students.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-550 leading-relaxed font-semibold">
                Empower your real estate business with direct access to
                thousands of verified students looking for their next home near
                campus.
              </p>
            </div>

            {/* Bullet list */}
            <div className="space-y-5">
              {/* Bullet 1 */}
              <div className="flex gap-4 p-4 bg-white/60 hover:bg-white rounded-2xl border border-slate-100 hover:border-purple-100 shadow-sm transition group">
                <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">
                    Instant Credibility
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Get the &apos;Verified Partner&apos; badge, instantly
                    building trust with cautious student renters and their
                    parents.
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex gap-4 p-4 bg-white/60 hover:bg-white rounded-2xl border border-slate-100 hover:border-purple-100 shadow-sm transition group">
                <div className="h-10 w-10 bg-purple-50 text-purple-650 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Zap className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">
                    Massive Reach
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Your listings are shown to over 5,000 active LASU students
                    every month, ensuring fast occupancy rates.
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="flex gap-4 p-4 bg-white/60 hover:bg-white rounded-2xl border border-slate-100 hover:border-purple-100 shadow-sm transition group">
                <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Shield className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">
                    Secure Inspections
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Integrated scheduling and digital tracking for inspections,
                    keeping you and the students safe.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Card */}
            <div className="relative rounded-2xl overflow-hidden h-44 sm:h-52 w-full shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
                alt="Segun A., testimonial"
                fill
                className="object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 max-w-sm text-left">
                <p className="text-xs sm:text-sm font-semibold italic leading-relaxed">
                  &ldquo;Nestld doubled my closing rate in just three
                  months. The student verification process is a
                  game-changer.&rdquo;
                </p>
                <p className="text-[10px] font-black uppercase tracking-wider text-purple-200">
                  — Segun A., Platinum Agent
                </p>
              </div>
            </div>
          </div>

          {/* Right Card Form Column */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-md space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-905">
                  Create Agent Account
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Complete the form below to start your verification process.
                </p>
              </div>

              <AgentRegisterForm
                onSuccess={() => router.push("/agent/dashboard")}
                onToggleLogin={() => {
                  setAuthTab("login");
                  setShowAuthModal(true);
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <AuthModal />
      <Footer />
    </div>
  );
}
