"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Home,
  SlidersHorizontal,
  Wifi,
  Zap,
  Shield,
  Droplet,
  Heart,
  MessageSquare,
  Star,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ChatDrawer from "@/components/ChatDrawer";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";

export default function HomeListingPage() {
  const {
    properties,
    favorites,
    toggleFavorite,
    setActiveChat,
    chatMessages,
    setChatMessages,
  } = useApp();

  // Search & Filter State
  const [searchLocation, setSearchLocation] = useState("");
  const [searchPropertyType, setSearchPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState(1000000);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Hero Carousel
  const HERO_SLIDES = [
    {
      id: 1,
      image: "/lasu_housing_hero.png",
      badge: "🏠 Verified Listings",
      heading: (
        <>
          Find Your Perfect Home <br />
          <span className="bg-linear-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
            Near LASU
          </span>
        </>
      ),
      sub: "Verified student hostels, self-contained flats & 2-bedroom apartments around Ojo.",
      accent: "from-purple-900/25 to-transparent",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1400",
      badge: "🤝 Roommate Matching",
      heading: (
        <>
          Meet Your Perfect <br />
          <span className="bg-linear-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            Flatmate
          </span>
        </>
      ),
      sub: "Swipe through student profiles filtered by lifestyle habits, budget, and department.",
      accent: "from-emerald-900/25 to-transparent",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1400",
      badge: "🔒 Safety First",
      heading: (
        <>
          Student-Verified <br />
          <span className="bg-linear-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
            Safety Ratings
          </span>
        </>
      ),
      sub: "Every listing is rated by real LASU students on water, power, security, and location.",
      accent: "from-orange-900/20 to-transparent",
    },
  ];

  const [heroSlide, setHeroSlide] = useState(0);
  const heroTimerRef = useRef(null);

  const startHeroTimer = () => {
    heroTimerRef.current = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    startHeroTimer();
    return () => clearInterval(heroTimerRef.current);
  }, []);

  const goToSlide = (idx) => {
    clearInterval(heroTimerRef.current);
    setHeroSlide(idx);
    startHeroTimer();
  };

  const prevSlide = () => goToSlide((heroSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => goToSlide((heroSlide + 1) % HERO_SLIDES.length);


  // Detail Modal State
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Toggle Type Checkbox
  const handleTypeCheckbox = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Toggle Amenity Chip
  const handleAmenityChip = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setPriceRange(1000000);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSearchLocation("");
    setSearchPropertyType("");
  };

  // Filter and Sort properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        if (
          searchLocation &&
          !prop.location.toLowerCase().includes(searchLocation.toLowerCase())
        ) {
          return false;
        }
        if (searchPropertyType && prop.type !== searchPropertyType) {
          return false;
        }
        if (prop.price > priceRange) {
          return false;
        }
        if (selectedTypes.length > 0 && !selectedTypes.includes(prop.type)) {
          return false;
        }
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amen) =>
            prop.amenities.includes(amen),
          );
          if (!hasAll) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "distance") {
          const distA = parseFloat(a.distance.split(" ")[0]);
          const distB = parseFloat(b.distance.split(" ")[0]);
          return distA - distB;
        }
        if (sortBy === "popular") return b.rating - a.rating;
        return 0;
      });
  }, [
    properties,
    searchLocation,
    searchPropertyType,
    priceRange,
    selectedTypes,
    selectedAmenities,
    sortBy,
  ]);

  // Open Chat Agent helper
  const handleOpenAgentChat = (prop, e) => {
    e.stopPropagation();
    const chatPartner = {
      id: prop.agent.name,
      name: prop.agent.name,
      avatar: prop.agent.avatar,
      role: `Agent at ${prop.agent.agency}`,
      listingTitle: prop.title,
    };
    setActiveChat(chatPartner);

    if (!chatMessages[chatPartner.id]) {
      setChatMessages((prev) => ({
        ...prev,
        [chatPartner.id]: [
          {
            id: "agent-greet",
            senderId: chatPartner.id,
            content: `Hi there! I saw you are interested in "${prop.title}" in ${prop.location}. How can I assist you with inspection or booking?`,
            timestamp: new Date(),
          },
        ],
      }));
    }
  };

  // Render Sidebar Filters Content
  const renderFiltersContent = (isMobile = false) => {
    return (
      <div className="space-y-6 text-left">
        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Price Range (₦)
            </span>
            <span className="text-xs font-bold text-purple-650 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
              Max: ₦{(priceRange / 1000).toFixed(0)}k
            </span>
          </div>
          <input
            type="range"
            min="150000"
            max="1000000"
            step="50000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-2 bg-slate-105 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>₦150k</span>
            <span>₦1M+</span>
          </div>
        </div>

        {/* Property Type Checkboxes */}
        <div className="space-y-3">
          <span className="block text-xs uppercase font-extrabold text-slate-400 tracking-wider">
            Property Type
          </span>
          <div className="space-y-2">
            {["Hostels", "Self-Contained", "2-Bedroom Flats"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeCheckbox(type)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      selectedTypes.includes(type)
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-slate-300 group-hover:border-slate-400 bg-white"
                    }`}
                  >
                    {selectedTypes.includes(type) && (
                      <CheckCircle2 className="h-3.5 w-3.5 stroke-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-650 group-hover:text-slate-800 transition">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities Chip Filters */}
        <div className="space-y-3">
          <span className="block text-xs uppercase font-extrabold text-slate-400 tracking-wider">
            Amenities
          </span>
          <div className="flex flex-wrap gap-2">
            {["Wifi", "Generator", "Security", "Borehole"].map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityChip(amenity)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all active:scale-95 ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-305 hover:bg-slate-100"
                  }`}
                >
                  {amenity === "Wifi" && <Wifi className="h-3 w-3" />}
                  {amenity === "Generator" && <Zap className="h-3 w-3" />}
                  {amenity === "Security" && <Shield className="h-3 w-3" />}
                  {amenity === "Borehole" && <Droplet className="h-3 w-3" />}
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        {!isMobile && (
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {}}
              className="w-full bg-purple-600 hover:bg-purple-750 text-white text-sm font-bold py-3 rounded-xl transition duration-150 active:scale-95 shadow-md shadow-purple-600/10"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col pb-20 md:pb-0 selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation Header */}
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative w-full min-h-[500px] sm:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Slides */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: idx === heroSlide ? 1 : 0, zIndex: idx === heroSlide ? 1 : 0 }}
            aria-hidden={idx !== heroSlide}
          >
            <div className="absolute inset-0 bg-slate-950">
              <Image
                src={slide.image}
                alt={`Nestld Hero Slide ${idx + 1}`}
                fill
                className="object-cover opacity-45 filter brightness-90"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/35 to-slate-950/75" />
              <div className={`absolute inset-0 bg-linear-to-r ${slide.accent}`} />
            </div>
          </div>
        ))}

        {/* Content — always on top */}
        <div className="relative z-10 max-w-4xl w-full mx-auto text-center flex flex-col items-center gap-6 sm:gap-8 px-4 py-10 sm:py-0">
          <div className="space-y-3 sm:space-y-4">
            <span
              key={heroSlide + "-badge"}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider animate-fade-in"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              {HERO_SLIDES[heroSlide].badge}
            </span>
            <h1
              key={heroSlide + "-heading"}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md animate-slide-up"
            >
              {HERO_SLIDES[heroSlide].heading}
            </h1>
            <p
              key={heroSlide + "-sub"}
              className="max-w-xl mx-auto text-sm sm:text-lg text-slate-200/90 font-medium animate-fade-in"
            >
              {HERO_SLIDES[heroSlide].sub}
            </p>
          </div>

          {/* Floating Search Bar */}
          <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full p-2 md:p-3 shadow-2xl shadow-slate-950/30 border border-white/50 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 select-none">
            <div className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 border-b md:border-b-0 md:border-r border-slate-100 flex items-center gap-3">
              <MapPin className="text-purple-600 h-5 w-5 shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Search area (e.g. Ojo, Iyana-Iba...)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-slate-800 placeholder-slate-400 font-semibold text-xs sm:text-sm mt-1"
                />
              </div>
            </div>

            <div className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 border-b md:border-b-0 md:border-r border-slate-100 flex items-center gap-3">
              <Home className="text-purple-600 h-5 w-5 shrink-0" />
              <div className="text-left w-full relative">
                <label className="block text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                  Property Type
                </label>
                <select
                  value={searchPropertyType}
                  onChange={(e) => setSearchPropertyType(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-slate-800 font-semibold text-xs sm:text-sm mt-1 cursor-pointer appearance-none pr-6"
                >
                  <option value="">Any Type</option>
                  <option value="Hostels">Hostels</option>
                  <option value="Self-Contained">Self-Contained</option>
                  <option value="2-Bedroom Flats">2-Bedroom Flats</option>
                </select>
                <ChevronDown className="absolute right-0 bottom-1.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button className="md:ml-2 bg-purple-600 hover:bg-purple-750 active:scale-95 text-white font-bold py-3.5 sm:py-4 px-6 md:px-8 rounded-xl md:rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 flex items-center justify-center gap-2 transition-all duration-200">
              <Search className="h-4.5 w-4.5" />
              <span className="text-xs sm:text-sm font-semibold">Search</span>
            </button>
          </div>
        </div>

        {/* Prev / Next Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white transition-all duration-200 active:scale-90"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white transition-all duration-200 active:scale-90"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${
                idx === heroSlide
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24 z-20">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-purple-600" />
                  <h2 className="font-extrabold text-slate-800 text-lg">
                    Filters
                  </h2>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition"
                >
                  Reset
                </button>
              </div>
              {renderFiltersContent(false)}
            </div>
          </aside>

          {/* Mobile Filters Drawer Trigger */}
          <div className="lg:hidden w-full flex gap-3 mb-2">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 font-bold py-3.5 px-4 transition text-xs active:scale-95"
            >
              <Filter className="h-4 w-4 text-purple-600" />
              Filter Listings
              {(selectedTypes.length > 0 ||
                selectedAmenities.length > 0 ||
                priceRange < 1000000) && (
                <span className="bg-purple-600 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {selectedTypes.length +
                    selectedAmenities.length +
                    (priceRange < 1000000 ? 1 : 0)}
                </span>
              )}
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-3.5 border border-slate-200 bg-white rounded-xl text-slate-555 hover:text-slate-800 text-xs font-bold transition active:scale-95"
            >
              Reset
            </button>
          </div>

          {/* Listings grid */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/60 shadow-sm text-left">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-805 font-sans">
                  Featured Properties
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 font-sans">
                  Found {filteredProperties.length} active property listing
                  {filteredProperties.length !== 1 && "s"} near Ojo
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sort by:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-bold text-slate-707 outline-none cursor-pointer hover:border-slate-300 transition appearance-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Lowest Price</option>
                    <option value="price-desc">Highest Price</option>
                    <option value="distance">Closest to LASU</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredProperties.map((prop) => {
                  const isFav = favorites.has(prop.id);
                  return (
                    <article
                      key={prop.id}
                      onClick={() => setSelectedProperty(prop)}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
                    >
                      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={prop.image}
                          alt={prop.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {prop.badge && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm z-10 bg-purple-600">
                            {prop.badge}
                          </span>
                        )}
                        {prop.verified && (
                          <span className="absolute top-3 right-12 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-emerald-600 shadow-sm z-10">
                            <CheckCircle2 className="h-3 w-3 stroke-3 text-emerald-505" />{" "}
                            Verified
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(prop.id);
                          }}
                          className="absolute top-3 right-3 h-8 w-8 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-md z-10"
                        >
                          <Heart
                            className={`h-4.5 w-4.5 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-slate-650"}`}
                          />
                        </button>
                      </div>
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-xs text-slate-555 font-semibold">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span className="truncate">{prop.location}</span>
                          </div>
                          <h3 className="font-extrabold text-slate-805 text-base leading-snug group-hover:text-purple-600 transition line-clamp-1">
                            {prop.title}
                          </h3>

                          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                            <div className="border-r border-slate-100 pr-1">
                              <span className="block text-[8px] text-slate-350">
                                Distance
                              </span>
                              <span className="text-slate-705 text-xs font-black lowercase mt-0.5 block">
                                {prop.distance.split(" ")[0]} km
                              </span>
                            </div>
                            <div className="border-r border-slate-100 px-1">
                              <span className="block text-[8px] text-slate-355">
                                Type
                              </span>
                              <span className="text-slate-705 text-xs font-black truncate mt-0.5 block">
                                {prop.type.split(" ")[0]}
                              </span>
                            </div>
                            <div className="pl-1">
                              <span className="block text-[8px] text-slate-355">
                                Availability
                              </span>
                              <span className="text-emerald-600 text-[10px] font-black truncate mt-0.5 block">
                                {prop.available.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {prop.amenities.map((amen) => (
                            <span
                              key={amen}
                              className="text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1"
                            >
                              {amen === "Wifi" && (
                                <Wifi className="h-2.5 w-2.5 text-purple-500" />
                              )}
                              {amen === "Generator" && (
                                <Zap className="h-2.5 w-2.5 text-amber-500" />
                              )}
                              {amen === "Security" && (
                                <Shield className="h-2.5 w-2.5 text-emerald-555" />
                              )}
                              {amen === "Borehole" && (
                                <Droplet className="h-2.5 w-2.5 text-blue-400" />
                              )}
                              {amen}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-lg sm:text-xl font-black text-slate-900">
                              ₦{(prop.price / 1000).toFixed(0)}k
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              /yr
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-extrabold text-slate-705">
                              {prop.rating}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProperty(prop);
                            }}
                            className="w-full bg-[#7C3AED] hover:bg-purple-700 active:scale-[0.98] text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md shadow-purple-550/10"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => handleOpenAgentChat(prop, e)}
                            className="w-full border border-slate-205 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-purple-600" />
                            Chat Agent
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border p-12 text-center max-w-lg mx-auto space-y-4">
                <SlidersHorizontal className="h-8 w-8 text-purple-500 animate-bounce mx-auto" />
                <h3 className="text-lg font-extrabold text-slate-805">
                  No matches found
                </h3>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-purple-650 text-white rounded-xl text-xs font-bold transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile bottom filters drawer */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          showMobileFilters
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white rounded-t-3xl p-6 overflow-y-auto transition-transform duration-300 transform ${
            showMobileFilters ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-purple-600" />
              <h2 className="font-extrabold text-slate-800 text-lg">Filters</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-purple-600"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="h-8 w-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-550 transition active:scale-90"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
          {renderFiltersContent(true)}
          <button
            onClick={() => setShowMobileFilters(false)}
            className="w-full bg-purple-600 hover:bg-purple-750 active:scale-95 text-white font-bold py-3.5 rounded-xl text-sm shadow-md mt-6 transition duration-150"
          >
            Apply & See Listings
          </button>
        </div>
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal />

      {/* Chat sliding thread */}
      <ChatDrawer />

      {/* Layout Footer */}
      <Footer />
    </div>
  );
}
