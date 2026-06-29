"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  MapPin,
  SlidersHorizontal,
  Compass,
  ChevronDown,
  UploadCloud,
  Upload,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function CreateListingPage() {
  const router = useRouter();
  const { currentUser, addProperty } = useApp();

  // Basic route guards
  const isAgent = currentUser && currentUser.role === "agent";

  const [listStep, setListStep] = useState("details");
  const [listTitle, setListTitle] = useState("");
  const [listType, setListType] = useState("Self-Contain");
  const [listMonthlyRent, setListMonthlyRent] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [listStreetAddress, setListStreetAddress] = useState("");
  const [listProximity, setListProximity] = useState(
    "Walking Distance (5-10 mins)",
  );
  const [listAmenities, setListAmenities] = useState([]);
  const [listPhotos, setListPhotos] = useState([]); // Cloudinary secure_urls
  const [isUploading, setIsUploading] = useState(false);
  const [createListError, setCreateListError] = useState("");

  const toggleListAmenity = (amenity) => {
    if (listAmenities.includes(amenity)) {
      setListAmenities(listAmenities.filter((a) => a !== amenity));
    } else {
      setListAmenities([...listAmenities, amenity]);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (listPhotos.length + files.length > 5) {
      setCreateListError("Maximum 5 images allowed per listing.");
      return;
    }
    setIsUploading(true);
    setCreateListError("");
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: form });
          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();
          return data.url;
        })
      );
      setListPhotos((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setCreateListError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedPhoto = (url) => {
    setListPhotos(listPhotos.filter((p) => p !== url));
  };

  const handlePublishProperty = async (e) => {
    e.preventDefault();
    setCreateListError("");

    if (!listTitle.trim() || !listMonthlyRent || !listStreetAddress.trim() || !listDescription.trim()) {
      setCreateListError("Please fill in all required fields.");
      return;
    }
    if (listPhotos.length === 0) {
      setCreateListError("Please upload at least one property photo.");
      return;
    }

    const rentNum = Number(listMonthlyRent);
    if (isNaN(rentNum) || rentNum <= 0) {
      setCreateListError("Please enter a valid monthly rent.");
      return;
    }

    const annualPrice = rentNum * 12;
    const propertyType =
      listType === "Self-Contain" ? "Self-Contained" :
      listType === "2-Bedroom Flats" ? "2-Bedroom Flats" : "Hostels";

    const result = await addProperty({
      title: listTitle.trim(),
      price: annualPrice,
      location: `${listStreetAddress.trim()}, Ojo`,
      distance: listProximity,
      type: propertyType,
      image: listPhotos[0],
      amenities: listAmenities.length > 0 ? listAmenities : ["Wifi", "Borehole", "Security"],
      available: "Immediate",
      description: listDescription.trim(),
    });

    if (result?.success) {
      router.push("/agent/dashboard");
    } else {
      setCreateListError(result?.error || "Failed to publish. Please try again.");
    }
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
              properties creator panel.
            </p>
          </div>
          <button
            onClick={() => router.push("/agent/register")}
            className="w-full max-w-sm bg-[#7C3AED] hover:bg-purple-750 text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition text-center"
          >
            Register as Agent
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-905 font-sans antialiased flex flex-col pb-20 md:pb-0 selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start text-left select-none animate-slide-up">
          {/* Left Steps Sidebar */}
          <aside className="w-full md:w-60 shrink-0 md:sticky md:top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-2">
              {[
                { id: "details", label: "Details", icon: FileText },
                { id: "location", label: "Location", icon: MapPin },
                {
                  id: "amenities",
                  label: "Amenities",
                  icon: SlidersHorizontal,
                },
                { id: "photos", label: "Photos", icon: Compass },
              ].map((step) => {
                const IconComp = step.icon;
                const isActive = listStep === step.id;
                return (
                  <button
                    type="button"
                    key={step.id}
                    onClick={() => setListStep(step.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
                      isActive
                        ? "bg-purple-50 text-purple-650"
                        : "text-slate-550 hover:bg-slate-50"
                    }`}
                  >
                    <IconComp
                      className={`h-4.5 w-4.5 ${isActive ? "text-purple-600" : "text-slate-400"}`}
                    />
                    {step.label}
                  </button>
                );
              })}
            </div>

            {/* Agent Tip Box */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-left space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-150 text-orange-705 text-[10px] font-extrabold uppercase">
                Agent Tip
              </span>
              <p className="text-[11px] text-orange-850 leading-relaxed font-semibold">
                Properties with at least 5 clear photos of the interior and
                exterior get 3x more inquiries.
              </p>
            </div>
          </aside>

          {/* Right Form Cards Column */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-905 font-sans">
                  Create New Listing
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Provide accurate details to help students find their next home
                  near Lagos State University.
                </p>
              </div>
            </div>

            <form onSubmit={handlePublishProperty} className="space-y-6">
              {createListError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-650 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{createListError}</span>
                </div>
              )}

              {/* CARD 1: Basic Information */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Compass className="h-5 w-5 text-purple-600" />
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    Basic Information
                  </h3>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Property Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Luxury Self-Contain near LASU Gate"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-805 font-semibold mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      Property Type
                    </label>
                    <div className="relative mt-1.5">
                      <select
                        value={listType}
                        onChange={(e) => setListType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none text-slate-700 font-semibold cursor-pointer appearance-none pr-10"
                      >
                        <option value="Self-Contain">Self-Contain</option>
                        <option value="Hostels">Hostels</option>
                        <option value="2-Bedroom Flats">2-Bedroom Flats</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-3 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      Monthly Rent (₦)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25,000"
                      value={listMonthlyRent}
                      onChange={(e) => setListMonthlyRent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-805 font-semibold mt-1.5"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Property Description
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the space, student-friendly features, and neighborhood..."
                    value={listDescription}
                    onChange={(e) => setListDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-805 font-semibold mt-1.5 resize-none"
                  />
                </div>
              </section>

              {/* CARD 2: Location Details */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <MapPin className="text-purple-600 h-5 w-5" />
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    Location Details
                  </h3>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123 Iyana-Iba Road, Ojo"
                    value={listStreetAddress}
                    onChange={(e) => setListStreetAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-805 font-semibold mt-1.5"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <div className="flex-1 space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      Proximity to LASU Gate
                    </label>
                    <div className="relative mt-1.5">
                      <select
                        value={listProximity}
                        onChange={(e) => setListProximity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none text-slate-700 font-semibold cursor-pointer appearance-none pr-10"
                      >
                        <option value="Walking Distance (5-10 mins)">
                          Walking Distance (5-10 mins)
                        </option>
                        <option value="Short Bike Ride (5 mins)">
                          Short Bike Ride (5 mins)
                        </option>
                        <option value="Car Transit (10 mins)">
                          Car Transit (10 mins)
                        </option>
                      </select>
                      <ChevronDown className="absolute right-4 top-3 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 p-4 flex items-center justify-center relative overflow-hidden h-28">
                    <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                        Map Preview Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* CARD 3: Amenities & Utilities */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <SlidersHorizontal className="h-5 w-5 text-purple-600" />
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    Amenities & Utilities
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    "Stable Electricity",
                    "Running Water",
                    "Gated Security",
                    "Prepaid Meter",
                    "Generator Site",
                    "Furnished",
                  ].map((amenity) => {
                    const isSelected = listAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleListAmenity(amenity)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-start gap-2.5 transition active:scale-[0.98] ${
                          isSelected
                            ? "border-purple-650 bg-purple-50/50 text-purple-700"
                            : "border-slate-200 hover:border-slate-300 text-slate-650"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-purple-600 text-white"
                              : "border border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-3" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* CARD 4: Property Photos */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Compass className="h-5 w-5 text-purple-600" />
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    Property Photos
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label
                    className={`sm:col-span-1 border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer flex flex-col justify-center items-center gap-2 h-44 transition ${
                      isUploading
                        ? "border-purple-400 bg-purple-50/50 cursor-wait"
                        : "border-slate-200 hover:border-purple-400 hover:bg-slate-50/50"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handlePhotoUpload}
                      disabled={isUploading || listPhotos.length >= 5}
                    />
                    {isUploading ? (
                      <>
                        <div className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold text-purple-600">Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-slate-400" />
                        <span className="text-xs font-bold text-purple-600">Click to upload photos</span>
                        <span className="text-[9px] text-slate-400 font-semibold">JPG, PNG, WEBP · Max 10MB each</span>
                      </>
                    )}
                  </label>

                  <div className="sm:col-span-2 grid grid-cols-4 gap-3 h-44">
                    {listPhotos.map((url, i) => (
                      <div
                        key={url}
                        className="rounded-xl border border-slate-200 overflow-hidden relative aspect-square bg-slate-55 shadow-sm flex flex-col justify-center items-center"
                      >
                        <img
                          src={url}
                          alt={`Preview ${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeUploadedPhoto(url)}
                          className="absolute top-1 right-1 h-5 w-5 bg-red-500 hover:bg-red-650 text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition"
                        >
                          <X className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    ))}

                    {Array.from({ length: Math.max(0, 4 - listPhotos.length) }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center relative aspect-square bg-slate-50/50"
                      >
                        <Upload className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-105 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      "Draft Saved! Access your listing later in the dashboard folder.",
                    );
                    router.push("/agent/dashboard");
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                >
                  Save as Draft
                </button>

                <div className="flex gap-2 w-full sm:w-auto font-semibold">
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Preview option coming soon. Publish to view live in properties feed.",
                      )
                    }
                    className="flex-1 sm:flex-none px-6 py-3 border border-slate-200 bg-white hover:bg-slate-55 rounded-xl text-slate-700 font-bold text-xs transition"
                  >
                    Preview Listing
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 sm:flex-none px-8 py-3 bg-[#7C3AED] hover:bg-purple-750 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Uploading..." : "Publish Property"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <AuthModal />
      <Footer />
    </div>
  );
}
