"use client";

import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

// Mock Initial Properties
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

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [favorites, setFavorites] = useState(new Set());
  const [chatMessages, setChatMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [matchesList, setMatchesList] = useState([]);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [showMatchCelebration, setShowMatchCelebration] = useState(null);
  const [showInbox, setShowInbox] = useState(false);

  // Advanced feature states
  const [inspectionBookings, setInspectionBookings] = useState([
    {
      id: "booking-1",
      propertyId: "prop-1",
      propertyName: "Platinum Heights Student Hostel",
      studentName: "Tobi Daniel",
      studentPhone: "+234 809 123 4567",
      date: "2026-07-02",
      time: "12:00 PM"
    }
  ]);

  const [propertyReviews, setPropertyReviews] = useState({
    "prop-1": [
      {
        id: "rev-1",
        studentName: "Femi Onadokun",
        comment: "Excellent hostel! Power is stable, and the borehole water is very clean.",
        rating: { security: 5, water: 4, power: 4, location: 5 }
      }
    ]
  });

  const updateUserProfile = (profileData) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...profileData
      };
    });
  };

  const requestInspection = (bookingDetail) => {
    const newBooking = {
      id: `booking-${Date.now()}`,
      ...bookingDetail
    };
    setInspectionBookings((prev) => [newBooking, ...prev]);
  };

  const addPropertyReview = (propertyId, review) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      ...review
    };
    setPropertyReviews((prev) => ({
      ...prev,
      [propertyId]: [newReview, ...(prev[propertyId] || [])]
    }));
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const addProperty = (newProperty) => {
    setProperties((prev) => [newProperty, ...prev]);
  };

  const deleteProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const sendMessage = (partnerId, content) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: "student-user",
      content: content.trim(),
      timestamp: new Date()
    };

    setChatMessages((prev) => ({
      ...prev,
      [partnerId]: [...(prev[partnerId] || []), newMessage]
    }));

    // Trigger simulated reply
    setTimeout(() => {
      let replyContent = "";
      if (activeChat?.role?.includes("Agent") || activeChat?.role?.includes("agency") || activeChat?.role?.includes("Properties")) {
        replyContent = `Thanks for reaching out! Let me check the schedule for ${activeChat.listingTitle || "inspection"}. I can offer inspections on Tuesdays and Thursdays between 10 AM and 3 PM. Does that work?`;
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
    }, 1500);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        showAuthModal,
        setShowAuthModal,
        authTab,
        setAuthTab,
        properties,
        setProperties,
        favorites,
        toggleFavorite,
        addProperty,
        deleteProperty,
        chatMessages,
        setChatMessages,
        activeChat,
        setActiveChat,
        sendMessage,
        matchesList,
        setMatchesList,
        currentSwipeIndex,
        setCurrentSwipeIndex,
        showMatchCelebration,
        setShowMatchCelebration,
        showInbox,
        setShowInbox,
        inspectionBookings,
        setInspectionBookings,
        propertyReviews,
        setPropertyReviews,
        updateUserProfile,
        requestInspection,
        addPropertyReview
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
