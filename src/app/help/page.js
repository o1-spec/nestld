"use client";

import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  ShieldAlert,
  Users,
  Building,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ChatDrawer from "@/components/ChatDrawer";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    category: "general",
    question: "What is Nestld?",
    answer:
      "Nestld is a premium student housing portal designed specifically for students of Lagos State University (LASU) searching for off-campus apartments around Ojo, Iyana-Iba, Okokomaiko, Igando, and PPL. We provide verified properties, roommate matching, and secure communication channels.",
  },
  {
    id: "faq-2",
    category: "students",
    question: "How do I search and filter for accommodation?",
    answer:
      "You can use the search bar on our properties homepage to search by specific locations around Ojo and select property types (Hostels, Self-Contained, or 2-Bedroom Flats). You can also use the Filter drawer to specify your maximum price range (₦/year) and desired amenities like stable electricity, running water, and security.",
  },
  {
    id: "faq-3",
    category: "roommates",
    question: "How does the Tinder-style Roommate Finder work?",
    answer:
      "Go to the 'Match Roommate' section. You'll see cards of fellow LASU students detailing their departments, budgets, and living habits. Swipe right (or click the Heart icon) if you'd like to team up to rent a place together. If they swipe right on you too, it's a mutual match! You can open your inbox and start messaging them immediately.",
  },
  {
    id: "faq-4",
    category: "agents",
    question: "How do I register as a verified housing agent?",
    answer:
      "Click on the 'Agent Portal' in the header navbar. If you are logged out, it will open the Agent Onboarding registration page. Fill in your name, official agency details, primary operating areas, and upload a valid government ID or NIN card. Once submitted, you'll be logged in and can start publishing listings immediately.",
  },
  {
    id: "faq-5",
    category: "agents",
    question: "What are the requirements for listing a property?",
    answer:
      "Only registered agents can post properties. Go to your dashboard and click 'Post Property'. You'll fill in basic listing info (title, monthly rent, description), location details, proximity to the LASU Gate, select amenities, and upload preview photos. Note that monthly rent is mathematically converted to annual format automatically on the homepage.",
  },
  {
    id: "faq-6",
    category: "safety",
    question: "How do I protect myself from rental scams?",
    answer:
      "Do NOT pay any agent fee, inspection fee, or rent upfront before physically inspecting the property. Ensure you verify the agent's identity and confirm the hostel's state. Nestld prompts safety warnings in all agent chats. If you notice a suspicious listing, use the support hotlines or form below to report it instantly.",
  },
  {
    id: "faq-7",
    category: "general",
    question: "Is Nestld free for students?",
    answer:
      "Yes! Searching for properties, swiping to match with flatmates, and messaging are completely free for all verified Lagos State University students. Our goal is to ensure housing security near campus.",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState({}); // { [faqId]: boolean }

  const toggleFaq = (id) => {
    setExpandedFaq((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col pb-20 md:pb-0 selection:bg-purple-100 selection:text-purple-900">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full text-left">
        <div className="max-w-4xl mx-auto space-y-10 animate-slide-up select-none">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="h-4 w-4" /> Support Center
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              How can we <span className="text-purple-600">help you?</span>
            </h1>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-500 font-semibold leading-relaxed">
              Find answers to common questions about student housings, roommate
              match swiping, and agent portal listings.
            </p>

            {/* Help Search Box */}
            <div className="max-w-lg mx-auto relative pt-2">
              <input
                type="text"
                placeholder="Search help articles (e.g. scams, roommates...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold outline-none focus:border-purple-650 focus:ring-1 focus:ring-purple-650/20 shadow-md text-slate-800"
              />
              <Search className="absolute left-4 top-6 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Navigation Category Chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: "all", label: "All FAQ" },
              { id: "general", label: "General" },
              { id: "students", label: "For Students" },
              { id: "roommates", label: "Roommates" },
              { id: "agents", label: "For Agents" },
              { id: "safety", label: "Safety Tips" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition active:scale-95 ${
                  activeCategory === cat.id
                    ? "bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-500/10"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordions Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-800">
              Frequently Asked Questions
            </h2>

            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaq[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm transition hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                      >
                        <span className="text-sm sm:text-base font-extrabold text-slate-800 pr-4">
                          {faq.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-purple-600 shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-5 pt-1 border-t border-slate-50 text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed text-left bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border rounded-2xl p-12 text-center space-y-4">
                <Search className="h-10 w-10 text-slate-305 mx-auto animate-pulse" />
                <h3 className="font-extrabold text-slate-800">
                  No help articles found
                </h3>
                <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
                  We couldn&apos;t find any articles matching your search query.
                  Try typing another term or contact support below.
                </p>
              </div>
            )}
          </div>

          {/* Contact Support Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-200">
            {/* Contact details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-905">
                  Still need help?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                  Our student housing team is available to assist you with
                  inquiries, safety guidelines, and verification.
                </p>
              </div>

              <div className="space-y-4 font-semibold text-slate-650">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-50 text-purple-650 rounded-xl flex items-center justify-center">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400">
                      Call Support hotline
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      +234 80-LASU-HOSTEL
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-50 text-purple-650 rounded-xl flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400">
                      Email support inbox
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      support@lasuaccommodate.edu.ng
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-50 text-purple-650 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400">
                      Office location
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      LASU Campus Road, Ojo, Lagos State, Nigeria
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-md">
              <h3 className="font-extrabold text-slate-800 text-sm pb-3 border-b border-slate-100 text-left">
                Send a Direct Message
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(
                    "Message sent successfully! We will get back to you shortly.",
                  );
                }}
                className="space-y-4 pt-3"
              >
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Inquiry Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what you need help with..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-750 text-white font-bold py-3 rounded-xl text-xs shadow-md transition"
                >
                  Submit Support Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <AuthModal />
      <ChatDrawer />
      <Footer />
    </div>
  );
}
