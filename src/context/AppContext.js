"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [chatMessages, setChatMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [matchesList, setMatchesList] = useState([]);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [showMatchCelebration, setShowMatchCelebration] = useState(null);
  const [showInbox, setShowInbox] = useState(false);

  const [inspectionBookings, setInspectionBookings] = useState([]);
  const [propertyReviews, setPropertyReviews] = useState({});
  const [roommatesDeck, setRoommatesDeck] = useState([]);

  // Auth Header Helper
  const getAuthHeaders = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("nestld_token");
      return token ? { "Authorization": `Bearer ${token}` } : {};
    }
    return {};
  };

  // 1. Initial Load of Properties and User Session
  useEffect(() => {
    // Load properties
    fetchProperties();

    // Check existing session
    const token = typeof window !== "undefined" ? localStorage.getItem("nestld_token") : null;
    if (token) {
      fetchSessionUser();
    }
  }, []);

  // Re-fetch user specific assets when currentUser state changes
  useEffect(() => {
    if (currentUser) {
      fetchFavorites();
      fetchInspections();
      fetchChatsInbox();
      if (currentUser.role === "student") {
        fetchRoommatesDeck();
      }
    } else {
      setFavorites(new Set());
      setInspectionBookings([]);
      setRoommatesDeck([]);
      setChatMessages({});
    }
  }, [currentUser]);

  // Load chat messages when activeChat is toggled
  useEffect(() => {
    if (activeChat) {
      fetchChatMessages(activeChat.name);
    }
  }, [activeChat]);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties");
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (e) {
      console.error("Failed to fetch properties:", e);
    }
  };

  const fetchSessionUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      } else {
        localStorage.removeItem("nestld_token");
        setCurrentUser(null);
      }
    } catch (e) {
      console.error("Session check error:", e);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(new Set(data.favorites));
      }
    } catch (e) {
      console.error("Failed to fetch favorites:", e);
    }
  };

  const fetchInspections = async () => {
    try {
      const res = await fetch("/api/inspections", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setInspectionBookings(data);
      }
    } catch (e) {
      console.error("Failed to fetch inspections:", e);
    }
  };

  const fetchRoommatesDeck = async () => {
    try {
      const res = await fetch("/api/roommates/deck", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setRoommatesDeck(data);
      }
    } catch (e) {
      console.error("Failed to fetch roommates deck:", e);
    }
  };

  const fetchChatsInbox = async () => {
    try {
      const res = await fetch("/api/chats", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setMatchesList(data);
      }
    } catch (e) {
      console.error("Failed to fetch chats inbox:", e);
    }
  };

  const fetchChatMessages = async (partnerName) => {
    try {
      const res = await fetch(`/api/chats/${partnerName}/messages`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => ({
          ...prev,
          [partnerName]: data
        }));
      }
    } catch (e) {
      console.error(`Failed to fetch messages for ${partnerName}:`, e);
    }
  };

  const fetchPropertyReviews = async (propertyId) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setPropertyReviews((prev) => ({
          ...prev,
          [propertyId]: data.reviews
        }));
        // Dynamically update this specific property's cached score representation
        setProperties((prevProps) =>
          prevProps.map((p) =>
            p.id === propertyId
              ? {
                  ...p,
                  rating: data.averages.security, // or average of the categories
                  reviewsCount: data.reviews.length
                }
              : p
          )
        );
        return data.averages;
      }
    } catch (e) {
      console.error("Failed to fetch property reviews:", e);
    }
    return { security: 5.0, water: 5.0, power: 5.0, location: 5.0 };
  };

  // Auth Operations
  const loginUser = (token, user) => {
    localStorage.setItem("nestld_token", token);
    setCurrentUser(user);
  };

  const logoutUser = () => {
    localStorage.removeItem("nestld_token");
    setCurrentUser(null);
    setActiveChat(null);
    setFavorites(new Set());
    setInspectionBookings([]);
    setRoommatesDeck([]);
    setMatchesList([]);
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        return { success: true };
      }
      return { success: false, error: "Failed to update profile values" };
    } catch (e) {
      console.error("Failed to update profile:", e);
      return { success: false, error: e.message };
    }
  };

  // Property Operations
  const addProperty = async (newProperty) => {
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(newProperty)
      });
      if (res.ok) {
        const data = await res.json();
        setProperties((prev) => [data.property, ...prev]);
        return { success: true };
      }
      const err = await res.json();
      return { success: false, error: err.error || "Failed to post listing" };
    } catch (e) {
      console.error("Failed to post property:", e);
      return { success: false, error: e.message };
    }
  };

  const deleteProperty = async (id) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        return { success: true };
      }
      return { success: false, error: "Failed to delete listing" };
    } catch (e) {
      console.error("Failed to delete property:", e);
      return { success: false, error: e.message };
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ propertyId: id })
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites((prev) => {
          const updated = new Set(prev);
          if (data.isFavorited) {
            updated.add(id);
          } else {
            updated.delete(id);
          }
          return updated;
        });
      }
    } catch (e) {
      console.error("Failed to toggle favorite:", e);
    }
  };

  // Booking scheduler
  const requestInspection = async (bookingDetail) => {
    try {
      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(bookingDetail)
      });
      if (res.ok) {
        const data = await res.json();
        setInspectionBookings((prev) => [data.booking, ...prev]);
        return { success: true };
      }
      return { success: false, error: "Failed to request inspection" };
    } catch (e) {
      console.error("Failed to schedule inspection:", e);
      return { success: false, error: e.message };
    }
  };

  // Review Operations
  const addPropertyReview = async (propertyId, review) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(review)
      });
      if (res.ok) {
        const data = await res.json();
        setPropertyReviews((prev) => ({
          ...prev,
          [propertyId]: [data.review, ...(prev[propertyId] || [])]
        }));
        // Trigger averages calculation re-fetch
        fetchPropertyReviews(propertyId);
        return { success: true };
      }
      return { success: false, error: "Failed to submit safety review" };
    } catch (e) {
      console.error("Failed to submit safety review:", e);
      return { success: false, error: e.message };
    }
  };

  // Chat Operations
  const sendMessage = async (partnerId, content) => {
    try {
      const res = await fetch(`/api/chats/${partnerId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setChatMessages((prev) => ({
          ...prev,
          [partnerId]: [...(prev[partnerId] || []), newMsg]
        }));
        
        // Trigger mock agent automatic reply after 1.5s
        if (partnerId.includes("Agent") || partnerId.includes("Mrs.") || partnerId.includes("Hon.") || partnerId.includes("Prince")) {
          setTimeout(async () => {
            const replyContent = `Thanks for reaching out! Let me check the schedule for inspection. I can offer viewings on Tuesdays and Thursdays. Does that work?`;
            // Post reply as an incoming message from the agent's perspective —
            // use the real logged-in user id so MongoDB stores it correctly
            const replyRes = await fetch(`/api/chats/${partnerId}/messages`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
              },
              body: JSON.stringify({ content: replyContent, senderOverride: partnerId })
            });
            if (replyRes.ok) {
              fetchChatMessages(partnerId);
            }
          }, 1500);
        }
      }
    } catch (e) {
      console.error("Failed to send message:", e);
    }
  };

  // Roommate Swipe Operations
  const swipeRoommate = async (targetUserId, action) => {
    try {
      const res = await fetch("/api/roommates/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ targetUserId, action })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isMatch) {
          setShowMatchCelebration(data.roommate);
          fetchChatsInbox();
        }
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      console.error("Failed to swipe roommate:", e);
      return { success: false };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
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
        roommatesDeck,
        swipeRoommate,
        fetchRoommatesDeck,
        fetchPropertyReviews,
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
