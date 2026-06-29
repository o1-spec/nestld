"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  MessageSquare,
  Building,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function AgentDashboardPage() {
  const router = useRouter();
  const { currentUser, properties, deleteProperty, setActiveChat } = useApp();

  // Route security block
  const isAgent = currentUser && currentUser.role === "agent";

  // Filter listings associated with the current agent
  const myProperties = useMemo(() => {
    if (!isAgent) return [];
    return properties.filter((p) => p.agent.name === currentUser.name);
  }, [properties, currentUser, isAgent]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (
      confirm(
        "Are you sure you want to delete this property listing? This action cannot be undone.",
      )
    ) {
      deleteProperty(id);
    }
  };

  const handleOpenStudentChat = (studentName) => {
    const chatPartner = {
      id: studentName,
      name: studentName,
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      role: "LASU Student",
      listingTitle: myProperties[0]?.title || "Rental Inquiry",
    };
    setActiveChat(chatPartner);
  };

  if (!isAgent) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col selection:bg-purple-100 selection:text-purple-900">
        <Header />
        <main className="max-w-xl mx-auto px-4 py-20 flex-1 flex flex-col justify-center items-center text-center space-y-6 animate-slide-up select-none">
          <AlertTriangle className="h-16 w-16 text-amber-500 animate-pulse" />
          <div className="space-y-2 text-left sm:text-center">
            <h2 className="text-2xl font-black text-slate-805">
              Agent Portal Authorization Required
            </h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              You must be logged in as a verified housing agent to access the
              agent management dashboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-2">
            <Link
              href="/agent/register"
              className="flex-1 bg-[#7C3AED] hover:bg-purple-750 text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition text-center"
            >
              Register as Agent
            </Link>
            <button
              onClick={() => router.push("/")}
              className="flex-1 border border-slate-205 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl text-xs transition"
            >
              Browse Student Feed
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col pb-20 md:pb-0 selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full text-left">
        <div className="space-y-8 animate-slide-up select-none">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-600">
                Verified Partner Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-905 mt-1">
                Welcome back, {currentUser.name}
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {currentUser.agency || "Independent Agency"}
              </p>
            </div>

            <Link
              href="/agent/create-listing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-purple-650 hover:bg-purple-750 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 self-start sm:self-auto"
            >
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              Post New Property
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-50 text-purple-650 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">
                  {myProperties.length}
                </span>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Active Listings
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">3</span>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Active Inquiries
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">12</span>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Total Property Views
                </span>
              </div>
            </div>
          </div>

          {/* Double Column: Listings & Inquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Active Listings Column */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-black text-slate-805">
                Your Active Listings
              </h2>

              {myProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition"
                    >
                      <div className="relative aspect-4/3 bg-slate-100">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => handleDelete(prop.id, e)}
                          className="absolute top-3 right-3 h-8 w-8 bg-white/95 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-md active:scale-90 transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="p-4 text-left space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">
                            {prop.location}
                          </span>
                          <h4 className="font-extrabold text-slate-800 text-sm mt-0.5 line-clamp-1 group-hover:text-purple-600 transition">
                            {prop.title}
                          </h4>
                        </div>
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                          <div>
                            <span className="text-base font-black text-slate-900">
                              ₦{(prop.price / 1000).toFixed(0)}k
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              /yr
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            ✓ Live
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border rounded-2xl p-12 text-center space-y-4">
                  <Building className="h-10 w-10 text-slate-350 mx-auto" />
                  <h4 className="font-extrabold text-slate-805">
                    No listings uploaded yet
                  </h4>
                  <Link
                    href="/agent/create-listing"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Upload Your First Property
                  </Link>
                </div>
              )}
            </div>

            {/* Inbound Inquiries Column */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-805">
                Received Inquiries
              </h2>

              <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
                {[
                  {
                    name: "Segun Adegoke",
                    listing: "Platinum Heights",
                    date: "Today, 10:24 AM",
                  },
                  {
                    name: "Mary Okon",
                    listing: "Apex Heights Flat",
                    date: "Yesterday",
                  },
                  {
                    name: "Kolawole Benson",
                    listing: "Platinum Heights",
                    date: "2 days ago",
                  },
                ].map((inq, i) => (
                  <div
                    key={i}
                    onClick={() => handleOpenStudentChat(inq.name)}
                    className="p-3 bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-100 rounded-xl text-left cursor-pointer transition flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">
                        {inq.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        Interested in {inq.listing}
                      </p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">
                        {inq.date}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-650 group-hover:translate-x-1 transition" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AuthModal />
      <Footer />
    </div>
  );
}
