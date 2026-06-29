"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  MapPin,
  Star,
  Wifi,
  Zap,
  Shield,
  Droplet,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PropertyDetailsModal({ property, onClose }) {
  const {
    currentUser,
    setShowAuthModal,
    setAuthTab,
    setActiveChat,
    chatMessages,
    setChatMessages,
    inspectionBookings,
    requestInspection,
    propertyReviews,
    addPropertyReview,
    fetchPropertyReviews,
  } = useApp();

  // Booking states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Review states
  const [reviewComment, setReviewComment] = useState("");
  const [ratingSecurity, setRatingSecurity] = useState(5);
  const [ratingWater, setRatingWater] = useState(5);
  const [ratingPower, setRatingPower] = useState(5);

  // Load reviews from MongoDB on mount/open
  React.useEffect(() => {
    if (property?.id) {
      fetchPropertyReviews(property.id);
    }
  }, [property?.id]);

  if (!property) return null;

  // Generate tomorrow and subsequent 3 days for booking options
  const bookingDates = [];
  for (let i = 1; i <= 4; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    bookingDates.push({
      formatted: d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      isoString: d.toISOString().split("T")[0],
    });
  }

  const timeSlots = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

  const handleOpenAgentChat = () => {
    const chatPartner = {
      id: property.agent.name,
      name: property.agent.name,
      avatar: property.agent.avatar,
      role: `Agent at ${property.agent.agency}`,
      listingTitle: property.title,
    };
    setActiveChat(chatPartner);

    if (!chatMessages[chatPartner.id]) {
      setChatMessages((prev) => ({
        ...prev,
        [chatPartner.id]: [
          {
            id: "agent-greet",
            senderId: chatPartner.id,
            content: `Hi there! I saw you are interested in "${property.title}" in ${property.location}. How can I assist you with inspection or booking?`,
            timestamp: new Date(),
          },
        ],
      }));
    }
    onClose();
  };

  const handleBookInspection = () => {
    if (!currentUser) {
      setAuthTab("login");
      setShowAuthModal(true);
      return;
    }
    if (currentUser.role !== "student") {
      alert("Only students can book property inspections.");
      return;
    }
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time slot.");
      return;
    }

    requestInspection({
      propertyId: property.id,
      propertyName: property.title,
      studentName: currentUser.name,
      studentPhone: "+234 809 123 4567", // Simulated contact phone
      date: selectedDate,
      time: selectedTimeSlot,
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDate("");
      setSelectedTimeSlot("");
    }, 3000);
  };

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthTab("login");
      setShowAuthModal(true);
      return;
    }
    if (currentUser.role !== "student") {
      alert("Only verified student accounts can post reviews.");
      return;
    }
    if (!reviewComment.trim()) {
      alert("Please type a comment.");
      return;
    }

    addPropertyReview(property.id, {
      studentName: currentUser.name,
      comment: reviewComment.trim(),
      rating: {
        security: Number(ratingSecurity),
        water: Number(ratingWater),
        power: Number(ratingPower),
        location: 5,
      },
    });

    setReviewComment("");
    setRatingSecurity(5);
    setRatingWater(5);
    setRatingPower(5);
  };

  const reviewsList = propertyReviews[property.id] || [];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-opacity animate-fade-in z-50">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col relative select-none animate-scale-up">
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-900/10 hover:bg-slate-900/20 text-slate-705 h-9 w-9 rounded-full flex items-center justify-center shadow z-10 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Banner Cover */}
        <div className="relative h-56 sm:h-80 w-full bg-slate-100 shrink-0">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white text-left space-y-2">
            <span className="bg-purple-650 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
              {property.type}
            </span>
            <h2 className="text-xl sm:text-3xl font-black leading-tight">
              {property.title}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1">
              <MapPin className="h-4.5 w-4.5 text-amber-400" />
              {property.location}
            </p>
          </div>
        </div>

        {/* Modal Info Content */}
        <div className="p-5 sm:p-8 space-y-6 text-left">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-55 rounded-2xl border border-slate-100 text-slate-655">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Distance to LASU
              </span>
              <span className="text-sm font-extrabold text-slate-800 mt-1.5 block">
                {property.distance.split(" ")[0]} km
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Pricing
              </span>
              <span className="text-sm font-extrabold text-slate-800 mt-1.5 block">
                ₦{(property.price / 1000).toFixed(0)}k/year
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Availability
              </span>
              <span className="text-sm font-extrabold text-emerald-600 mt-1.5 block">
                {property.available}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Security Rating
              </span>
              <span className="text-sm font-extrabold text-slate-800 mt-1.5 flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />{" "}
                {property.rating}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 text-base">
              About the Property
            </h3>
            <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-semibold">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-800 text-base">
              Key Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {property.amenities.map((amen) => (
                <div
                  key={amen}
                  className="flex items-center gap-2 p-3 bg-white border border-slate-205 rounded-xl font-bold text-xs text-slate-700"
                >
                  {amen === "Wifi" && (
                    <Wifi className="h-4 w-4 text-purple-650" />
                  )}
                  {amen === "Generator" && (
                    <Zap className="h-4 w-4 text-amber-500" />
                  )}
                  {amen === "Security" && (
                    <Shield className="h-4 w-4 text-emerald-555" />
                  )}
                  {amen === "Borehole" && (
                    <Droplet className="h-4 w-4 text-blue-500" />
                  )}
                  <span>{amen}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING SECTION */}
          <div className="border-t border-slate-100 pt-6 space-y-4 relative">
            {bookingSuccess && (
              <div className="absolute top-4 right-0 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm z-10 animate-slide-up">
                <Check className="h-4 w-4 stroke-3" />
                <span>Inspection Request sent successfully!</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-800">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h3 className="font-extrabold text-base">
                Schedule Physical Inspection
              </h3>
            </div>

            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Always inspect the property before transferring rent. Choose a
              target date and time block to coordinate with the agent.
            </p>

            <div className="space-y-3">
              {/* Date Toggles */}
              <div className="space-y-1.5">
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Select Date
                </span>
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {bookingDates.map((item) => {
                    const isSelected = selectedDate === item.isoString;
                    return (
                      <button
                        key={item.isoString}
                        type="button"
                        onClick={() => setSelectedDate(item.isoString)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                          isSelected
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "bg-slate-55 border-slate-200/85 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {item.formatted}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-1.5 pt-1">
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Select Time Slot
                </span>
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "bg-slate-55 border-slate-200/85 text-slate-650 hover:bg-slate-100"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Booking CTA */}
              <button
                type="button"
                onClick={handleBookInspection}
                className="w-full bg-purple-600 hover:bg-purple-750 active:scale-95 text-white font-bold py-3.5 rounded-xl text-xs shadow-md shadow-purple-600/10 transition mt-4"
              >
                Request Inspection Booking
              </button>
            </div>
          </div>

          {/* VERIFIED REVIEWS & RATINGS */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-800">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <h3 className="font-extrabold text-base">
                Student Reviews & Safety Audits
              </h3>
            </div>

            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Verify local community conditions. Student ratings contribute
              directly to listing badge certifications.
            </p>

            {/* List existing reviews */}
            <div className="space-y-3 pt-2">
              {reviewsList.length > 0 ? (
                reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-left space-y-2.5"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="block text-xs font-extrabold text-slate-800">
                          {rev.studentName}
                        </span>
                        <span className="inline-block text-[9px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold mt-0.5">
                          Verified Tenant
                        </span>
                      </div>

                      {/* Sub-Ratings Chips */}
                      <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                        <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-extrabold text-slate-500">
                          🛡️ Sec: {rev.rating.security}/5
                        </span>
                        <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-extrabold text-slate-500">
                          💧 Water: {rev.rating.water}/5
                        </span>
                        <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-extrabold text-slate-500">
                          ⚡ Power: {rev.rating.power}/5
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 border border-dashed rounded-2xl text-center text-xs text-slate-400 font-semibold">
                  No verified student reviews posted for this hostel yet.
                </div>
              )}
            </div>

            {/* Review composer (student only) */}
            {(!currentUser || currentUser.role === "student") && (
              <form
                onSubmit={handleAddReviewSubmit}
                className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-2xl space-y-4 text-left"
              >
                <h4 className="text-xs font-extrabold text-slate-850 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-purple-650" /> Add Your
                  Review
                </h4>

                {/* 3 Rating Selectors */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Security
                    </span>
                    <select
                      value={ratingSecurity}
                      onChange={(e) => setRatingSecurity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none cursor-pointer mt-1"
                    >
                      <option value="5">5 Excellent</option>
                      <option value="4">4 Good</option>
                      <option value="3">3 Average</option>
                      <option value="2">2 Poor</option>
                      <option value="1">1 Terrible</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Water
                    </span>
                    <select
                      value={ratingWater}
                      onChange={(e) => setRatingWater(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none cursor-pointer mt-1"
                    >
                      <option value="5">5 Stable</option>
                      <option value="4">4 Good</option>
                      <option value="3">3 Irregular</option>
                      <option value="2">2 Poor</option>
                      <option value="1">1 Dry</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Power Supply
                    </span>
                    <select
                      value={ratingPower}
                      onChange={(e) => setRatingPower(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none cursor-pointer mt-1"
                    >
                      <option value="5">5 Backup (Solar)</option>
                      <option value="4">4 Stable Grid</option>
                      <option value="3">3 Rotational</option>
                      <option value="2">2 Blackouts</option>
                      <option value="1">1 No Light</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <textarea
                    required
                    rows={3}
                    placeholder="Write details about electricity stability, water cleanness, and security environment..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-purple-655 rounded-xl p-3 text-xs font-semibold outline-none resize-none mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-750 active:scale-95 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition"
                >
                  Submit verified review
                </button>
              </form>
            )}
          </div>

          {/* Agent details footer bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h4 className="text-sm font-extrabold text-slate-805">
                  {property.agent.name}
                </h4>
                <p className="text-[10px] text-slate-500 font-bold">
                  {property.agent.agency}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleOpenAgentChat}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#7C3AED] text-white font-bold text-xs rounded-xl shadow-md"
              >
                Chat Agent
              </button>
              <button
                onClick={() => window.open(`tel:${property.agent.phone}`)}
                className="flex-1 sm:flex-none px-6 py-3 border border-slate-205 text-slate-755 font-bold text-xs rounded-xl transition"
              >
                Call Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
