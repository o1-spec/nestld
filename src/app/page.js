"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  X,
  ChevronRight,
  ChevronLeft,
  Send,
  Sparkles,
  Plus,
  Compass,
  Users,
  Check,
  Building,
  Maximize2,
  Filter,
  DollarSign,
  ChevronDown
} from "lucide-react";

// Mock Properties Data around Ojo/LASU
const INITIAL_PROPERTIES = [
  {
    id: "prop-1",
    title: "Platinum Heights Student Hostel",
    price: 250000,
    location: "Iyana-Iba, Main Gate Area",
    distance: "0.4 km from LASU Main Gate",
    type: "Hostels",
    rating: 4.8,
    reviewsCount: 24,
    badge: "New Listing",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    amenities: ["Wifi", "24/7 Power", "Security", "Borehole"],
    verified: true,
    available: "Immediate",
    agent: {
      name: "Prince Olamide",
      phone: "+234 812 345 6789",
      agency: "Ojo Campus Realty",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    },
    description: "Located just a short walk from the LASU main gate, Platinum Heights offers high-speed Wi-Fi, round-the-clock solar backup power, secure gated perimeter, and constant running water. Perfect for students looking for close proximity and a study-friendly atmosphere."
  },
  {
    id: "prop-2",
    title: "Blue Roof Residence Villa",
    price: 450000,
    location: "Igando, Behind Health Centre",
    distance: "2.1 km from LASU Main Gate",
    type: "2-Bedroom Flats",
    rating: 4.9,
    reviewsCount: 18,
    badge: "Top Rated",
    badgeType: "warning",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    amenities: ["Generator", "Borehole", "Security"],
    verified: true,
    available: "1st July, 2026",
    agent: {
      name: "Mrs. Ngozi Alao",
      phone: "+234 703 987 6543",
      agency: "Apex Accommodations Ltd",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
    },
    description: "Spacious 2-Bedroom flat in a highly secured, quiet neighborhood behind the Igando Health Centre. Features large parking space, clean borehole water, separate prepaid meters, and 24/7 security patrol. Ideal for student groups seeking to share costs."
  },
  {
    id: "prop-3",
    title: "Legacy Student Suites",
    price: 320000,
    location: "Ojo-Alaba Road",
    distance: "1.5 km from LASU Main Gate",
    type: "Self-Contained",
    rating: 4.6,
    reviewsCount: 15,
    badge: "Popular",
    badgeType: "success",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800",
    amenities: ["Wifi", "Security", "Borehole"],
    verified: true,
    available: "Immediate",
    agent: {
      name: "Hon. Segun Gbadamosi",
      phone: "+234 809 555 1234",
      agency: "Alaba Properties Group",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    description: "Modern, tiled single self-contained apartments along the main Ojo-Alaba road. Boasts high natural ventilation, reliable water pump, security fencing, and quick transit access straight to the campus gate."
  },
  {
    id: "prop-4",
    title: "Unity Palms Shared Hostels",
    price: 180000,
    location: "PPL Axis, Ojo",
    distance: "1.8 km from LASU Main Gate",
    type: "Hostels",
    rating: 4.3,
    reviewsCount: 12,
    badgeType: "",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
    amenities: ["Borehole", "Security"],
    verified: false,
    available: "Immediate",
    agent: {
      name: "Prince Olamide",
      phone: "+234 812 345 6789",
      agency: "Ojo Campus Realty",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    },
    description: "Affordable shared hostel accommodations in the bustling PPL student community. A highly vibrant area filled with student retail shops, restaurants, and study circles. Fenced property with shared clean borehole water access."
  },
  {
    id: "prop-5",
    title: "Vantage Point Premium Suites",
    price: 380000,
    location: "Okokomaiko, Ojo",
    distance: "1.2 km from LASU Main Gate",
    type: "Self-Contained",
    rating: 4.7,
    reviewsCount: 20,
    badge: "Verified Agent",
    badgeType: "success",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800",
    amenities: ["Wifi", "Security", "Borehole"],
    verified: true,
    available: "Immediate",
    agent: {
      name: "Mrs. Ngozi Alao",
      phone: "+234 703 987 6543",
      agency: "Apex Accommodations Ltd",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
    },
    description: "Sleek and newly built self-contain apartment located in Okokomaiko. Serviced with premium water pumping, 24-hour security guards, fully tiled interiors, built-in wardrobes, and pre-installed high-speed Wi-Fi."
  },
  {
    id: "prop-6",
    title: "Apex Heights 2-Bedroom Flat",
    price: 550000,
    location: "LASU Road, Iba",
    distance: "0.9 km from LASU Main Gate",
    type: "2-Bedroom Flats",
    rating: 4.9,
    reviewsCount: 31,
    badge: "Trending",
    badgeType: "danger",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
    amenities: ["Wifi", "Generator", "Security", "Borehole"],
    verified: true,
    available: "August 2026",
    agent: {
      name: "Hon. Segun Gbadamosi",
      phone: "+234 809 555 1234",
      agency: "Alaba Properties Group",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    description: "Ultimate luxury flat on LASU road. Equipped with a central backup generator, gated environment, clean running water, and stylish kitchen cabinets. Perfect for up to 4 students planning to rent together."
  }
];

// Mock Roommates Data for Swipe Deck
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
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
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
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
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
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
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
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
  }
];

export default function HomeListingPage() {
  // Navigation & View State
  const [activeView, setActiveView] = useState("properties"); // "properties" | "roommates"
  const [favorites, setFavorites] = useState(new Set());
  
  // Search & Filter State
  const [searchLocation, setSearchLocation] = useState("");
  const [searchPropertyType, setSearchPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState(600000);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Interactive Overlays State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeChat, setActiveChat] = useState(null); // { id, name, avatar, role, listingTitle }
  const [chatMessages, setChatMessages] = useState({});
  const [activeMessageInput, setActiveMessageInput] = useState("");

  // Roommate Swiper State
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [swipedMates, setSwipedMates] = useState({}); // { mateId: 'like' | 'dislike' }
  const [matchesList, setMatchesList] = useState([]);
  const [showMatchCelebration, setShowMatchCelebration] = useState(null); // mate object
  
  // Tinder Swipe Gesture State
  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Chat auto-reply helper
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeChat]);

  // Handle Favorites toggle
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const updated = new Set(favorites);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setFavorites(updated);
  };

  // Handle sidebar checkbox filters
  const handleTypeCheckbox = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Handle sidebar chip filters
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
    return INITIAL_PROPERTIES.filter((prop) => {
      // Location Search Match
      if (searchLocation && !prop.location.toLowerCase().includes(searchLocation.toLowerCase())) {
        return false;
      }
      // Floating Search Type Match
      if (searchPropertyType && prop.type !== searchPropertyType) {
        return false;
      }
      // Price Slider Match
      if (prop.price > priceRange) {
        return false;
      }
      // Property Types Match
      if (selectedTypes.length > 0 && !selectedTypes.includes(prop.type)) {
        return false;
      }
      // Amenities Match (must contain all selected amenities)
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every((amen) => prop.amenities.includes(amen));
        if (!hasAll) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") {
        return b.id.localeCompare(a.id);
      }
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "distance") {
        const distA = parseFloat(a.distance.split(" ")[0]);
        const distB = parseFloat(b.distance.split(" ")[0]);
        return distA - distB;
      }
      if (sortBy === "popular") {
        return b.rating - a.rating;
      }
      return 0;
    });
  }, [searchLocation, searchPropertyType, priceRange, selectedTypes, selectedAmenities, sortBy]);

  // Tinder swipe interactions
  const handleSwipe = (direction) => {
    if (currentSwipeIndex >= ROOMMATES_DECK.length) return;
    
    const mate = ROOMMATES_DECK[currentSwipeIndex];
    setSwipedMates((prev) => ({ ...prev, [mate.id]: direction }));
    
    if (direction === "like") {
      if (Math.random() > 0.3) {
        setTimeout(() => {
          setShowMatchCelebration(mate);
          setMatchesList((prev) => [...prev, mate]);
          setChatMessages((prev) => ({
            ...prev,
            [mate.id]: [
              {
                id: "initial-match",
                senderId: "system",
                content: `You matched with ${mate.name}! Start chatting to team up for your housing around Ojo.`,
                timestamp: new Date()
              }
            ]
          }));
        }, 600);
      }
    }
    
    setSwipeOffset({ x: direction === "like" ? 400 : -400, y: 0 });
    setTimeout(() => {
      setCurrentSwipeIndex((prev) => prev + 1);
      setSwipeOffset({ x: 0, y: 0 });
    }, 200);
  };

  // Drag hander for roommates
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

  // Trigger agent chat
  const handleOpenAgentChat = (prop, e) => {
    if (e) e.stopPropagation();
    const chatPartner = {
      id: prop.agent.name,
      name: prop.agent.name,
      avatar: prop.agent.avatar,
      role: `Agent at ${prop.agent.agency}`,
      listingTitle: prop.title
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
            timestamp: new Date()
          }
        ]
      }));
    }
  };

  // Send message simulation
  const handleSendMessage = () => {
    if (!activeMessageInput.trim() || !activeChat) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: "student-user",
      content: activeMessageInput.trim(),
      timestamp: new Date()
    };

    const partnerId = activeChat.id;

    setChatMessages((prev) => ({
      ...prev,
      [partnerId]: [...(prev[partnerId] || []), newMessage]
    }));
    setActiveMessageInput("");

    setTimeout(() => {
      let replyContent = "";
      if (activeChat.role.includes("Agent")) {
        replyContent = `Thanks for reaching out! Let me check the schedule for ${activeChat.listingTitle}. I can offer inspections on Tuesdays and Thursdays between 10 AM and 3 PM. Does that work?`;
      } else {
        replyContent = `Hey! Thanks for swiping right. Yes! I'm really interested in splitting bills around Ojo. What's your current budget limit?`;
      }
      
      setChatMessages((prev) => ({
        ...prev,
        [partnerId]: [
          ...(prev[partnerId] || []),
          {
            id: `reply-${Date.now()}`,
            senderId: partnerId,
            content: replyContent,
            timestamp: new Date()
          }
        ]
      }));
    }, 1550);
  };

  // Start chat with matched roommate
  const startRoommateChat = (mate) => {
    const chatPartner = {
      id: mate.id,
      name: mate.name,
      avatar: mate.avatar,
      role: `${mate.department} (${mate.yearOfStudy})`,
      listingTitle: "Roommate Match"
    };
    setActiveChat(chatPartner);
    setShowMatchCelebration(null);
  };

  // Render Sidebar Filters Content
  const renderFiltersContent = (isMobile = false) => {
    return (
      <div className="space-y-6 text-left">
        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Price Range (₦)</span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
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
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>₦150k</span>
            <span>₦1M+</span>
          </div>
        </div>

        {/* Property Type Checkboxes */}
        <div className="space-y-3">
          <span className="block text-xs uppercase font-extrabold text-slate-400 tracking-wider">Property Type</span>
          <div className="space-y-2">
            {["Hostels", "Self-Contained", "2-Bedroom Flats"].map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeCheckbox(type)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    selectedTypes.includes(type)
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "border-slate-300 group-hover:border-slate-400 bg-white"
                  }`}>
                    {selectedTypes.includes(type) && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities Chip Filters */}
        <div className="space-y-3">
          <span className="block text-xs uppercase font-extrabold text-slate-400 tracking-wider">Amenities</span>
          <div className="flex flex-wrap gap-2">
            {["Wifi", "Generator", "Security", "Borehole"].map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  onClick={() => handleAmenityChip(amenity)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all active:scale-95 ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
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
              onClick={() => {}}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-3 rounded-xl transition duration-150 active:scale-95 shadow-md shadow-purple-600/10"
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
      
      {/* 1. Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/85 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveView("properties"); resetFilters(); }}>
            <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Compass className="h-5 w-5 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                LASU Accommodate
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-amber-500 mt-[-2px]">
                Ojo Student Housing
              </span>
            </div>
          </div>

          {/* Navigation Items (Hidden on mobile - handled by mobile bottom nav) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <button
              onClick={() => setActiveView("properties")}
              className={`relative py-2 transition-all ${
                activeView === "properties"
                  ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600 after:rounded-full"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveView("roommates")}
              className={`relative py-2 transition-all flex items-center gap-2 ${
                activeView === "roommates"
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
            </button>
            <button className="text-slate-500 hover:text-slate-900">Agent Portal</button>
            <button className="text-slate-500 hover:text-slate-900">Help</button>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            {matchesList.length > 0 && (
              <button
                onClick={() => {
                  const mate = matchesList[matchesList.length - 1];
                  startRoommateChat(mate);
                }}
                className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 relative transition"
                title="Open Chats"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full animate-ping"></span>
              </button>
            )}
            
            <button className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-55 text-sm font-semibold transition">
              Login
            </button>
            
            <button className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-750 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-purple-600/10 hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-200">
              Post Property
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Airbnb-Style Floating Search */}
      <section className="relative w-full h-[400px] sm:h-[460px] flex items-center justify-center overflow-hidden px-4">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 bg-slate-950">
          <Image
            src="/lasu_housing_hero.png"
            alt="LASU Student Housing Sunset"
            fill
            className="object-cover opacity-45 filter brightness-90 transition-transform duration-10000 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/35 to-slate-950/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent" />
        </div>

        <div className="relative max-w-4xl w-full mx-auto text-center flex flex-col items-center gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-amber-400" /> Tailored For Lagos State University Students
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Find Your Perfect Home <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">Near LASU</span>
            </h1>
            <p className="max-w-xl mx-auto text-sm sm:text-lg text-slate-200/90 font-medium">
              Verified student housings, hostels, and roommate matching tailored for Lagos State University students.
            </p>
          </div>

          {/* Airbnb Floating Search Bar */}
          <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full p-2 md:p-3 shadow-2xl shadow-slate-950/30 border border-white/50 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 select-none">
            
            {/* Field 1: Location */}
            <div className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 border-b md:border-b-0 md:border-r border-slate-100 flex items-center gap-3">
              <MapPin className="text-purple-600 h-5 w-5 flex-shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Location</label>
                <input
                  type="text"
                  placeholder="Search area (e.g. Ojo, Iyana-Iba...)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-slate-800 placeholder-slate-400 font-semibold text-xs sm:text-sm mt-1"
                />
              </div>
            </div>

            {/* Field 2: Property Type Dropdown */}
            <div className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 border-b md:border-b-0 md:border-r border-slate-100 flex items-center gap-3">
              <Home className="text-purple-600 h-5 w-5 flex-shrink-0" />
              <div className="text-left w-full relative">
                <label className="block text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Property Type</label>
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

            {/* Search Trigger Button */}
            <button className="md:ml-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold py-3.5 sm:py-4 px-6 md:px-8 rounded-xl md:rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 flex items-center justify-center gap-2 transition-all duration-200">
              <Search className="h-4.5 w-4.5" />
              <span className="text-xs sm:text-sm font-semibold">Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        
        {activeView === "properties" ? (
          /* PROPERTIES VIEW */
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
            
            {/* DESKTOP FILTERS SIDEBAR (Hidden on mobile) */}
            <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 z-20">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4.5 w-4.5 text-purple-600" />
                    <h2 className="font-extrabold text-slate-800 text-lg">Filters</h2>
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

            {/* MOBILE FLOATING FILTER TRIGGER BAR (Only on mobile) */}
            <div className="lg:hidden w-full flex gap-3 mb-2">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 font-bold py-3.5 px-4 transition text-xs active:scale-95"
              >
                <Filter className="h-4 w-4 text-purple-600" />
                Filter Listings
                {(selectedTypes.length > 0 || selectedAmenities.length > 0 || priceRange < 1000000) && (
                  <span className="bg-purple-600 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                    {selectedTypes.length + selectedAmenities.length + (priceRange < 1000000 ? 1 : 0)}
                  </span>
                )}
              </button>
              
              <button
                onClick={resetFilters}
                className="px-4 py-3.5 border border-slate-200 bg-white rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold transition active:scale-95"
              >
                Reset
              </button>
            </div>

            {/* PROPERTIES LISTINGS GRID */}
            <div className="flex-1 w-full space-y-6">
              
              {/* Grid Header Controls */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/60 shadow-sm text-left">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 font-sans">Featured Properties</h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Found {filteredProperties.length} active property listing{filteredProperties.length !== 1 && "s"} near Ojo
                  </p>
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300 transition appearance-none"
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

              {/* PROPERTIES GRID */}
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
                        {/* Image Panel */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                          <Image
                            src={prop.image}
                            alt={prop.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Floating Badges */}
                          {prop.badge && (
                            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm z-10 ${
                              prop.badgeType === "new" ? "bg-purple-650" :
                              prop.badgeType === "success" ? "bg-emerald-500" :
                              prop.badgeType === "warning" ? "bg-amber-500" : "bg-red-500"
                            }`}>
                              {prop.badge}
                            </span>
                          )}

                          {/* Verified Badge */}
                          {prop.verified && (
                            <span className="absolute top-3 right-12 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-emerald-600 shadow-sm z-10">
                              <CheckCircle2 className="h-3 w-3 stroke-[3] text-emerald-500" /> Verified
                            </span>
                          )}

                          {/* Favorite button */}
                          <button
                            onClick={(e) => toggleFavorite(prop.id, e)}
                            className="absolute top-3 right-3 h-8 w-8 bg-white/95 hover:bg-white text-slate-655 rounded-full flex items-center justify-center shadow-md active:scale-90 transition z-10 animate-fade-in"
                          >
                            <Heart className={`h-4.5 w-4.5 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-slate-650"}`} />
                          </button>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <span className="truncate">{prop.location}</span>
                            </div>

                            <h3 className="font-extrabold text-slate-805 text-base leading-snug group-hover:text-purple-600 transition line-clamp-1">
                              {prop.title}
                            </h3>

                            {/* Details Info Row */}
                            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                              <div className="border-r border-slate-100 pr-1">
                                <span className="block text-[8px] text-slate-350">Distance</span>
                                <span className="text-slate-705 text-xs font-black lowercase mt-0.5 block">{prop.distance.split(" ")[0]} km</span>
                              </div>
                              <div className="border-r border-slate-100 px-1">
                                <span className="block text-[8px] text-slate-355">Type</span>
                                <span className="text-slate-705 text-xs font-black truncate mt-0.5 block">{prop.type.split(" ")[0]}</span>
                              </div>
                              <div className="pl-1">
                                <span className="block text-[8px] text-slate-355">Availability</span>
                                <span className="text-emerald-600 text-[10px] font-black truncate mt-0.5 block">{prop.available.split(" ")[0]}</span>
                              </div>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-1">
                            {prop.amenities.map((amen) => (
                              <span key={amen} className="text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                {amen === "Wifi" && <Wifi className="h-2.5 w-2.5 text-purple-500" />}
                                {amen === "Generator" && <Zap className="h-2.5 w-2.5 text-amber-500" />}
                                {amen === "Security" && <Shield className="h-2.5 w-2.5 text-emerald-500" />}
                                {amen === "Borehole" && <Droplet className="h-2.5 w-2.5 text-blue-400" />}
                                {amen}
                              </span>
                            ))}
                          </div>

                          {/* Price & Rating */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div>
                              <span className="text-lg sm:text-xl font-black text-slate-900">₦{(prop.price / 1000).toFixed(0)}k</span>
                              <span className="text-xs font-semibold text-slate-500">/yr</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-extrabold text-slate-705">{prop.rating}</span>
                              <span className="text-[10px] font-bold text-slate-400">({prop.reviewsCount})</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProperty(prop);
                              }}
                              className="w-full bg-[#7C3AED] hover:bg-purple-700 active:scale-[0.98] text-white text-xs font-bold py-2.5 rounded-xl transition duration-150 text-center shadow-md shadow-purple-500/10"
                            >
                              View Details
                            </button>
                            <button
                              onClick={(e) => handleOpenAgentChat(prop, e)}
                              className="w-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] text-slate-700 text-xs font-bold py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-1.5"
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
                /* Empty state */
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
                  <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <SlidersHorizontal className="h-8 w-8 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800">No properties match your filter selection</h3>
                  <p className="text-slate-550 text-sm">
                    Try broadening your budget limit, adjusting the location query, or clearing the selected amenities parameters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* PAGINATION */}
              {filteredProperties.length > 0 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <button className="h-10 w-10 border border-slate-200 bg-white hover:bg-slate-50 active:scale-90 text-slate-650 rounded-xl flex items-center justify-center transition">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="h-10 w-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                    1
                  </button>
                  <button className="h-10 w-10 border border-slate-200 bg-white hover:bg-slate-50 active:scale-90 text-slate-655 rounded-xl flex items-center justify-center transition">
                    2
                  </button>
                  <button className="h-10 w-10 border border-slate-200 bg-white hover:bg-slate-55 active:scale-90 text-slate-655 rounded-xl flex items-center justify-center transition">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* ROOMMATES TINDER SWIPER VIEW */
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 sm:gap-8 items-stretch select-none">
            
            {/* Matching Deck Area */}
            <div className="flex-1 flex flex-col items-center gap-6 justify-center">
              
              <div className="text-center space-y-1">
                <span className="inline-flex items-center gap-1 text-xs uppercase font-extrabold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  <Sparkles className="h-3 w-3 text-amber-500 fill-amber-400" /> Roommate Matching
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-805">Swipe to Connect</h2>
                <p className="text-slate-500 text-xs sm:text-sm max-w-sm">
                  Swipe right to match and chat with potential flatmates looking for accommodation around Ojo.
                </p>
              </div>

              {/* Deck Deck container */}
              <div className="relative w-full max-w-[320px] sm:max-w-[340px] h-[430px] sm:h-[460px] flex items-center justify-center">
                {currentSwipeIndex < ROOMMATES_DECK.length ? (
                  <>
                    {/* UNDER CARD PREVIEW (visual depth) */}
                    {currentSwipeIndex + 1 < ROOMMATES_DECK.length && (
                      <div className="absolute w-full h-full bg-white border border-slate-200 rounded-3xl shadow-md transform scale-[0.96] translate-y-3 opacity-60 pointer-events-none" />
                    )}

                    {/* TOP ACTIVE CARD */}
                    <div
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      style={{
                        transform: `translate(${swipeOffset.x}px, ${swipeOffset.y}px) rotate(${swipeOffset.x / 12}deg)`,
                        transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                      }}
                      className="absolute w-full h-full bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing flex flex-col justify-between touch-none"
                    >
                      {/* Avatar & Badges */}
                      <div className="relative flex-1 bg-slate-100 overflow-hidden">
                        <img
                          src={ROOMMATES_DECK[currentSwipeIndex].avatar}
                          alt={ROOMMATES_DECK[currentSwipeIndex].name}
                          className="w-full h-full object-cover object-center pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Budget Tag */}
                        <span className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold px-3 py-1 rounded-full text-[10px] sm:text-xs shadow-md">
                          Budget: ₦{(ROOMMATES_DECK[currentSwipeIndex].budget / 1000).toFixed(0)}k/yr
                        </span>

                        {/* Swipe indicator visual cues */}
                        {swipeOffset.x > 30 && (
                          <div className="absolute top-16 left-6 border-4 border-emerald-500 text-emerald-500 uppercase font-black tracking-widest px-3 py-1 rounded-md text-xl transform -rotate-12 select-none opacity-80">
                            LIKE
                          </div>
                        )}
                        {swipeOffset.x < -30 && (
                          <div className="absolute top-16 right-6 border-4 border-red-500 text-red-500 uppercase font-black tracking-widest px-3 py-1 rounded-md text-xl transform rotate-12 select-none opacity-80">
                            NOPE
                          </div>
                        )}

                        {/* Profile Brief Info */}
                        <div className="absolute bottom-4 left-4 right-4 text-white text-left space-y-1">
                          <h3 className="font-extrabold text-lg sm:text-xl">
                            {ROOMMATES_DECK[currentSwipeIndex].name}, {ROOMMATES_DECK[currentSwipeIndex].age}
                          </h3>
                          <p className="text-xs font-semibold text-slate-300">
                            {ROOMMATES_DECK[currentSwipeIndex].department} ({ROOMMATES_DECK[currentSwipeIndex].yearOfStudy})
                          </p>
                        </div>
                      </div>

                      {/* Bio & Specific Habits */}
                      <div className="p-4 sm:p-5 bg-white text-left space-y-4 border-t border-slate-100 flex-shrink-0">
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-3">
                          &ldquo;{ROOMMATES_DECK[currentSwipeIndex].bio}&rdquo;
                        </p>

                        {/* Habit stats */}
                        <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-extrabold text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                            <span>Cleanliness: {ROOMMATES_DECK[currentSwipeIndex].habits.cleanliness}/5</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                            <span>Sleep: {ROOMMATES_DECK[currentSwipeIndex].habits.sleep}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                            <span>Noise tolerance: {ROOMMATES_DECK[currentSwipeIndex].habits.noise}/5</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                            <span>Smoke/Drink: {ROOMMATES_DECK[currentSwipeIndex].habits.smoke ? "Yes" : "No"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Deck Empty state */
                  <div className="w-full h-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-4 shadow-md">
                    <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="h-8 w-8 text-amber-500" />
                    </div>
                    <h3 className="font-extrabold text-slate-805 text-base sm:text-lg">You&apos;ve reached the end of the deck!</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      We will notify you immediately once more Lagos State University students register and setup their roommate matching profiles around Ojo.
                    </p>
                    <button
                      onClick={() => setCurrentSwipeIndex(0)}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition duration-150 active:scale-95 shadow-md shadow-purple-500/10"
                    >
                      Swipe Again
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons underneath Card */}
              {currentSwipeIndex < ROOMMATES_DECK.length && (
                <div className="flex items-center gap-6 pt-2">
                  <button
                    onClick={() => handleSwipe("dislike")}
                    className="w-14 h-14 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full flex items-center justify-center text-red-500 hover:text-red-650 shadow-md hover:shadow-lg active:scale-90 transition-all duration-200"
                    title="Nope"
                  >
                    <X className="h-7 w-7 stroke-[3]" />
                  </button>
                  <button
                    onClick={() => handleSwipe("like")}
                    className="w-16 h-16 bg-purple-600 hover:bg-purple-750 text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 active:scale-90 transition-all duration-200"
                    title="Like"
                  >
                    <Heart className="h-8 w-8 fill-current" />
                  </button>
                </div>
              )}

            </div>

            {/* Match sidebar list (Right side) */}
            <div className="w-full md:w-80 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col gap-6 shadow-sm">
              <div className="text-left">
                <h3 className="font-extrabold text-lg text-slate-800">Your Matches</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Matched students looking to share</p>
              </div>

              <div className="flex-1 overflow-y-auto min-h-[200px] md:min-h-[250px] space-y-3">
                {matchesList.length > 0 ? (
                  matchesList.map((mate) => (
                    <div
                      key={mate.id}
                      onClick={() => startRoommateChat(mate)}
                      className="p-3 bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-100 rounded-2xl flex items-center gap-3 cursor-pointer transition group"
                    >
                      <img
                        src={mate.avatar}
                        alt={mate.name}
                        className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-105 transition"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-800 truncate group-hover:text-purple-600 transition">
                          {mate.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold truncate">
                          {mate.department} • ₦{(mate.budget/1000).toFixed(0)}k
                        </p>
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                          <Check className="h-2.5 w-2.5 stroke-[3]" /> Mutual Match
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-3">
                    <Users className="h-10 w-10 text-slate-300" />
                    <p className="text-xs text-slate-400 font-bold max-w-[180px]">
                      No roommate matches yet. Keep swiping!
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Only visible on mobile devices) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg flex items-center justify-around z-45 px-6">
        <button
          onClick={() => setActiveView("properties")}
          className={`flex flex-col items-center justify-center w-20 h-full gap-1 transition ${
            activeView === "properties" ? "text-purple-600" : "text-slate-400 hover:text-slate-650"
          }`}
        >
          <Compass className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-wider">Properties</span>
        </button>
        
        <button
          onClick={() => setActiveView("roommates")}
          className={`flex flex-col items-center justify-center w-20 h-full gap-1 transition relative ${
            activeView === "roommates" ? "text-purple-600" : "text-slate-400 hover:text-slate-650"
          }`}
        >
          <Users className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-wider">Roommates</span>
          {matchesList.length > 0 && (
            <span className="absolute top-2 right-4 bg-red-500 text-white rounded-full text-[8px] w-3.5 h-3.5 flex items-center justify-center font-bold">
              {matchesList.length}
            </span>
          )}
        </button>
      </div>

      {/* MOBILE BOTTOM SLIDE-UP FILTERS DRAWER */}
      <div className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
        showMobileFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className={`absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white rounded-t-3xl p-6 overflow-y-auto transition-transform duration-300 transform ${
          showMobileFilters ? "translate-y-0" : "translate-y-full"
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-purple-600" />
              <h2 className="font-extrabold text-slate-800 text-lg">Filters</h2>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={resetFilters} className="text-xs font-bold text-purple-600">Reset</button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="h-8 w-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition active:scale-90"
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

      {/* 4. Overlay Modals & Sliding Panels */}

      {/* Detail Modal (Lightbox/Popup style) */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-opacity animate-fade-in z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col relative select-none animate-slide-up">
            
            {/* Close trigger */}
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 h-9 w-9 rounded-full flex items-center justify-center shadow z-10 transition active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image banner */}
            <div className="relative h-56 sm:h-80 w-full bg-slate-100 flex-shrink-0">
              <Image
                src={selectedProperty.image}
                alt={selectedProperty.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white text-left space-y-2">
                <span className="bg-purple-650 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  {selectedProperty.type}
                </span>
                <h2 className="text-xl sm:text-3xl font-black">{selectedProperty.title}</h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1">
                  <MapPin className="h-4.5 w-4.5 text-amber-400" />
                  {selectedProperty.location}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 space-y-6 text-left">
              
              {/* Distance and Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-650">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Distance to LASU</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1.5 block">{selectedProperty.distance.split(" ")[0]} km</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pricing</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1.5 block">₦{(selectedProperty.price/1000).toFixed(0)}k/year</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Move-in Availability</span>
                  <span className="text-sm font-extrabold text-emerald-600 mt-1.5 block">{selectedProperty.available}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Security Rating</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1.5 block flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {selectedProperty.rating}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-800 text-base">About the Property</h3>
                <p className="text-slate-650 text-sm leading-relaxed font-semibold">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-slate-800 text-base">Key Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedProperty.amenities.map((amen) => (
                    <div key={amen} className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700">
                      {amen === "Wifi" && <Wifi className="h-4 w-4 text-purple-650" />}
                      {amen === "Generator" && <Zap className="h-4 w-4 text-amber-500" />}
                      {amen === "Security" && <Shield className="h-4 w-4 text-emerald-555" />}
                      {amen === "Borehole" && <Droplet className="h-4 w-4 text-blue-500" />}
                      <span>{amen}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent contact info & Action bar */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProperty.agent.avatar}
                    alt={selectedProperty.agent.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-805">{selectedProperty.agent.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">{selectedProperty.agent.agency}</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      handleOpenAgentChat(selectedProperty);
                      setSelectedProperty(null);
                    }}
                    className="flex-1 sm:flex-none px-6 py-3 bg-[#7C3AED] hover:bg-purple-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    Chat Agent
                  </button>
                  <button
                    onClick={() => window.open(`tel:${selectedProperty.agent.phone}`)}
                    className="flex-1 sm:flex-none px-6 py-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95 text-slate-750 font-bold text-xs rounded-xl transition"
                  >
                    Call Agent
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Sliding Agent/Roommate Chat Drawer (Right-side slide over) */}
      {activeChat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left relative border-l border-slate-200 select-none">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-55">
              <div className="flex items-center gap-3 text-left">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">{activeChat.name}</h3>
                  <p className="text-[10px] text-slate-500 font-semibold">{activeChat.role}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveChat(null)}
                className="h-8 w-8 bg-white hover:bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-550 transition active:scale-90"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Conversation log body */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[10px] font-bold text-amber-700 text-left">
                ⚠️ Avoid paying agent fees upfront before physically inspecting student listings around Ojo.
              </div>

              {chatMessages[activeChat.id] &&
                chatMessages[activeChat.id].map((msg) => {
                  const isMe = msg.senderId === "student-user";
                  const isSys = msg.senderId === "system";
                  
                  if (isSys) {
                    return (
                      <div key={msg.id} className="text-center py-2">
                        <span className="inline-block bg-purple-50 text-purple-800 text-[10px] font-bold px-3 py-1 rounded-full border border-purple-100">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}>
                      <div className={`max-w-[75%] rounded-2xl p-3.5 text-xs font-semibold text-left shadow-sm ${
                        isMe
                          ? "bg-purple-600 text-white rounded-br-none"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                      }`}>
                        <p className="leading-relaxed">{msg.content}</p>
                        <span className={`block text-[8px] mt-1.5 text-right font-semibold ${isMe ? "text-purple-200" : "text-slate-400"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center gap-2 bg-white mb-16 md:mb-0">
              <input
                type="text"
                placeholder="Type a message..."
                value={activeMessageInput}
                onChange={(e) => setActiveMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-slate-55 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-purple-600 focus:bg-white text-slate-800 placeholder-slate-400 font-semibold"
              />
              <button
                onClick={handleSendMessage}
                className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl shadow-md active:scale-95 transition"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confetti Match Celebration Pop-up */}
      {showMatchCelebration && (
        <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
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
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent leading-none">
                It&apos;s a Match!
              </h2>
              <p className="text-xs text-slate-500 font-bold">
                You and {showMatchCelebration.name} matched.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left">
              <p className="text-xs text-slate-650 font-semibold italic">
                &ldquo;{showMatchCelebration.bio}&rdquo;
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => startRoommateChat(showMatchCelebration)}
                className="w-full bg-[#7C3AED] hover:bg-purple-750 text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition active:scale-95"
              >
                Send a Message
              </button>
              <button
                onClick={() => setShowMatchCelebration(null)}
                className="w-full bg-slate-55 hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-xs transition border border-slate-200"
              >
                Keep Swiping
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer Section (Hidden on mobile to preserve layout space) */}
      <footer className="hidden sm:block bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-black text-white">LASU Accommodate</h3>
            <p className="leading-relaxed">
              Designed and built for Lagos State University (LASU) students. Making off-campus student accommodation searches and flatmate sharing around Ojo simple and verified.
            </p>
          </div>
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-black text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Agent Registration</a></li>
              <li><a href="#" className="hover:text-white transition">LASU Campus Map</a></li>
              <li><a href="#" className="hover:text-white transition">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition font-semibold">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="space-y-4 text-left font-semibold">
            <h3 className="text-sm font-black text-white">Support</h3>
            <p>Ojo Campus Road, Ojo, Lagos State, Nigeria</p>
            <p>Email: support@lasuaccommodate.edu.ng</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 text-center font-semibold">
          <p>© {new Date().getFullYear()} LASU Accommodate. Built with premium Next.js and Tailwind CSS.</p>
        </div>
      </footer>

    </div>
  );
}
