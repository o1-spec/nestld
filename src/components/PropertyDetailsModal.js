"use client";

import React from "react";
import Image from "next/image";
import { X, MapPin, Star, Wifi, Zap, Shield, Droplet } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PropertyDetailsModal({ property, onClose }) {
  const { setActiveChat, chatMessages, setChatMessages } = useApp();

  if (!property) return null;

  const handleOpenAgentChat = () => {
    const chatPartner = {
      id: property.agent.name,
      name: property.agent.name,
      avatar: property.agent.avatar,
      role: `Agent at ${property.agent.agency}`,
      listingTitle: property.title
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
            timestamp: new Date()
          }
        ]
      }));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-opacity animate-fade-in z-50">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col relative select-none animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 h-9 w-9 rounded-full flex items-center justify-center shadow z-10 transition"><X className="h-5 w-5" /></button>
        
        <div className="relative h-56 sm:h-80 w-full bg-slate-100 shrink-0">
          <Image src={property.image} alt={property.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white text-left space-y-2">
            <span className="bg-purple-650 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">{property.type}</span>
            <h2 className="text-xl sm:text-3xl font-black">{property.title}</h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1"><MapPin className="h-4.5 w-4.5 text-amber-400" />{property.location}</p>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-6 text-left">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-55 rounded-2xl border border-slate-100 text-slate-650">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Distance to LASU</span>
              <span className="text-sm font-extrabold text-slate-800 mt-1.5 block">{property.distance.split(" ")[0]} km</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pricing</span>
              <span className="text-sm font-extrabold text-slate-800 mt-1.5 block">₦{(property.price/1000).toFixed(0)}k/year</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Move-in Availability</span>
              <span className="text-sm font-extrabold text-emerald-600 mt-1.5 block">{property.available}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Security Rating</span>
              <span className="text-sm font-extrabold text-slate-800 mt-1.5 flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {property.rating}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 text-base">About the Property</h3>
            <p className="text-slate-650 text-sm leading-relaxed font-semibold">{property.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-800 text-base">Key Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {property.amenities.map((amen) => (
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

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={property.agent.avatar} alt={property.agent.name} className="w-12 h-12 rounded-full object-cover border" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-805">{property.agent.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold">{property.agent.agency}</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={handleOpenAgentChat} className="flex-1 sm:flex-none px-6 py-3 bg-[#7C3AED] text-white font-bold text-xs rounded-xl shadow-md">Chat Agent</button>
              <button onClick={() => window.open(`tel:${property.agent.phone}`)} className="flex-1 sm:flex-none px-6 py-3 border border-slate-205 text-slate-755 font-bold text-xs rounded-xl transition">Call Agent</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
