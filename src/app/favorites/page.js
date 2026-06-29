"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Search,
  ShieldCheck,
  MapPin,
  Eye,
  Scale,
  X,
  Check,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ChatDrawer from "@/components/ChatDrawer";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, properties, toggleFavorite } = useApp();

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [compareList, setCompareList] = useState([]); // Array of property objects
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Filter properties that are in favorites Set
  const savedProperties = properties.filter((p) => favorites.has(p.id));

  const handleToggleCompare = (property) => {
    setCompareList((prev) => {
      const exists = prev.find((item) => item.id === property.id);
      if (exists) {
        return prev.filter((item) => item.id !== property.id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 properties at a time.");
          return prev;
        }
        return [...prev, property];
      }
    });
  };

  const isComparing = (id) => compareList.some((item) => item.id === id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col pb-20 md:pb-0 selection:bg-purple-100 selection:text-purple-900">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full text-left">
        <div className="max-w-6xl mx-auto space-y-8 animate-slide-up select-none">
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Saved <span className="text-purple-600">Properties</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                Manage and compare off-campus student accommodation bookmarked
                on the feed.
              </p>
            </div>

            {savedProperties.length > 0 && (
              <button
                onClick={() => {
                  if (compareList.length < 2) {
                    alert("Please select at least 2 properties to compare.");
                    return;
                  }
                  setShowCompareModal(true);
                }}
                className={`px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2 active:scale-95 shadow-sm ${
                  compareList.length >= 2
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-650/10"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Scale className="h-4.5 w-4.5" />
                Compare Selected ({compareList.length})
              </button>
            )}
          </div>

          {/* Grid or Empty State */}
          {savedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((prop) => {
                const isSaved = favorites.has(prop.id);
                const isSelectedForCompare = isComparing(prop.id);

                return (
                  <div
                    key={prop.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-purple-200/80 transition-all duration-300 overflow-hidden flex flex-col group relative"
                  >
                    {/* Favorite icon on top right */}
                    <button
                      onClick={() => {
                        toggleFavorite(prop.id);
                        // Also remove from compare list if removed from favorites
                        setCompareList((prev) =>
                          prev.filter((item) => item.id !== prop.id),
                        );
                      }}
                      className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-100/50 text-red-500 hover:scale-105 active:scale-90 transition-all"
                    >
                      <Heart className="h-4.5 w-4.5 fill-red-500 stroke-red-500" />
                    </button>

                    {/* Image Panel */}
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={prop.image}
                        alt={prop.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {prop.badge && (
                        <span className="absolute bottom-4 left-4 inline-flex px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                          {prop.badge}
                        </span>
                      )}
                    </div>

                    {/* Property Card Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                          <MapPin className="h-3.5 w-3.5 text-purple-600" />
                          <span>{prop.location}</span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-purple-650 transition truncate">
                          {prop.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed line-clamp-2">
                          {prop.description}
                        </p>
                      </div>

                      {/* Pricing & Footer Actions */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Annual Rent
                          </span>
                          <span className="text-base font-black text-slate-800">
                            ₦{(prop.price / 1000).toFixed(0)}k
                            <span className="text-xs font-semibold text-slate-500">
                              /yr
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleCompare(prop)}
                            className={`p-2.5 rounded-full border transition active:scale-95 ${
                              isSelectedForCompare
                                ? "bg-purple-50 text-purple-650 border-purple-200"
                                : "border-slate-200 hover:bg-slate-50 text-slate-500"
                            }`}
                            title={
                              isSelectedForCompare
                                ? "Remove from comparison"
                                : "Add to comparison"
                            }
                          >
                            <Scale className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => setSelectedProperty(prop)}
                            className="bg-purple-600 hover:bg-purple-750 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 active:scale-95 shadow-sm shadow-purple-600/10 transition"
                          >
                            <Eye className="h-4 w-4" /> View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center space-y-4 shadow-md max-w-lg mx-auto">
              <Heart className="h-12 w-12 text-slate-300 mx-auto animate-pulse" />
              <h3 className="text-lg font-black text-slate-800">
                No Saved Hostels
              </h3>
              <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
                Start browsing student accommodations around Ojo and click the
                heart icon on any listing to bookmark them here.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-md transition mt-2"
              >
                Explore Listings
              </button>
            </div>
          )}

          {/* Comparison Overlay Matrix Modal */}
          {showCompareModal && (
            <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl overflow-hidden relative animate-scale-up select-none flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="bg-purple-600 p-6 text-white shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-6 w-6 animate-pulse" />
                    <div>
                      <h3 className="text-xl font-black">
                        Compare Accommodations
                      </h3>
                      <p className="text-xs text-purple-200 font-semibold">
                        Side-by-side analysis of your selected hostels.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="bg-purple-700 hover:bg-purple-800 text-white h-8 w-8 rounded-full flex items-center justify-center transition active:scale-90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Comparison Grid Table */}
                <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest w-1/4">
                          Criteria
                        </th>
                        {compareList.map((p) => (
                          <th
                            key={p.id}
                            className="py-3 px-4 w-1/4 text-center"
                          >
                            <div className="relative h-20 w-32 mx-auto rounded-xl overflow-hidden mb-2">
                              <Image
                                src={p.image}
                                alt={p.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="block text-xs font-extrabold text-slate-800 line-clamp-1">
                              {p.title}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold text-slate-655">
                      {/* Price */}
                      <tr>
                        <td className="py-4 px-4 font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                          Annual Rent
                        </td>
                        {compareList.map((p) => (
                          <td
                            key={p.id}
                            className="py-4 px-4 text-center font-black text-purple-650"
                          >
                            ₦{(p.price / 1000).toFixed(0)}k/year
                          </td>
                        ))}
                      </tr>

                      {/* Location */}
                      <tr>
                        <td className="py-4 px-4 font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                          Location Axis
                        </td>
                        {compareList.map((p) => (
                          <td
                            key={p.id}
                            className="py-4 px-4 text-center text-xs"
                          >
                            {p.location}
                          </td>
                        ))}
                      </tr>

                      {/* Proximity to LASU Gate */}
                      <tr>
                        <td className="py-4 px-4 font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                          LASU Proximity
                        </td>
                        {compareList.map((p) => (
                          <td
                            key={p.id}
                            className="py-4 px-4 text-center text-xs text-amber-600 font-bold"
                          >
                            {p.distance}
                          </td>
                        ))}
                      </tr>

                      {/* Property Type */}
                      <tr>
                        <td className="py-4 px-4 font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                          Property Type
                        </td>
                        {compareList.map((p) => (
                          <td key={p.id} className="py-4 px-4 text-center">
                            {p.type}
                          </td>
                        ))}
                      </tr>

                      {/* Rating */}
                      <tr>
                        <td className="py-4 px-4 font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                          Rating
                        </td>
                        {compareList.map((p) => (
                          <td
                            key={p.id}
                            className="py-4 px-4 text-center text-xs font-bold text-slate-800"
                          >
                            ⭐ {p.rating} ({p.reviewsCount} reviews)
                          </td>
                        ))}
                      </tr>

                      {/* Verification Status */}
                      <tr>
                        <td className="py-4 px-4 font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                          Verification
                        </td>
                        {compareList.map((p) => (
                          <td key={p.id} className="py-4 px-4 text-center">
                            {p.verified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                                <ShieldCheck className="h-3 w-3" /> Verified
                                Partner
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                                Pending
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Amenities checklist */}
                      <tr>
                        <td className="py-4 px-4 font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                          Amenities
                        </td>
                        {compareList.map((p) => (
                          <td key={p.id} className="py-4 px-4 text-left">
                            <div className="flex flex-wrap gap-1 justify-center max-w-[150px] mx-auto">
                              {p.amenities.map((am) => (
                                <span
                                  key={am}
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[9px] font-bold border border-slate-100"
                                >
                                  <Check className="h-2 w-2 text-purple-600 stroke-4" />{" "}
                                  {am}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Compare Actions Footer */}
                <div className="p-4 bg-slate-50 border-t flex justify-end shrink-0">
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="bg-purple-650 hover:bg-purple-750 text-white font-bold py-3 px-6 rounded-xl text-xs transition"
                  >
                    Done Comparing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Selected Property Details Sheet */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      <AuthModal />
      <ChatDrawer />
      <Footer />
    </div>
  );
}
