"use client";

import React, { useState } from "react";
import { UploadCloud, Check, ChevronDown, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AgentRegisterForm({ onSuccess, onToggleLogin }) {
  const { setCurrentUser } = useApp();

  const [agentRegName, setAgentRegName] = useState("");
  const [agentRegPhone, setAgentRegPhone] = useState("");
  const [agentRegEmail, setAgentRegEmail] = useState("");
  const [agentRegPassword, setAgentRegPassword] = useState("");
  const [agentRegAgency, setAgentRegAgency] = useState("");
  const [agentRegArea, setAgentRegArea] = useState("");
  const [agentRegUploadDoc, setAgentRegUploadDoc] = useState(null);
  const [agentAgreeTerms, setAgentAgreeTerms] = useState(false);
  const [agentAgreeAccurate, setAgentAgreeAccurate] = useState(false);
  const [agentRegError, setAgentRegError] = useState("");

  const handleAgentRegisterSubmit = (e) => {
    e.preventDefault();
    setAgentRegError("");

    if (
      !agentRegName.trim() ||
      !agentRegPhone.trim() ||
      !agentRegEmail.trim() ||
      !agentRegPassword ||
      !agentRegArea
    ) {
      setAgentRegError("Please fill out all required fields.");
      return;
    }

    if (!agentAgreeTerms || !agentAgreeAccurate) {
      setAgentRegError(
        "You must agree to the Terms of Service and accurate listings representation.",
      );
      return;
    }

    const registeredAgent = {
      name: agentRegName.trim(),
      email: agentRegEmail.trim(),
      role: "agent",
      agency: agentRegAgency.trim() || "Independent Agent",
    };

    setCurrentUser(registeredAgent);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleAgentRegisterSubmit} className="space-y-4">
      {agentRegError && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-650 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{agentRegError}</span>
        </div>
      )}

      {/* Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Doe"
            value={agentRegName}
            onChange={(e) => setAgentRegName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
            Phone Number
          </label>
          <input
            type="tel"
            required
            placeholder="+234 800 000 0000"
            value={agentRegPhone}
            onChange={(e) => setAgentRegPhone(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
          Official Email Address
        </label>
        <input
          type="email"
          required
          placeholder="agent@agency.com"
          value={agentRegEmail}
          onChange={(e) => setAgentRegEmail(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
          Password
        </label>
        <input
          type="password"
          required
          placeholder="••••••••"
          value={agentRegPassword}
          onChange={(e) => setAgentRegPassword(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
        />
      </div>

      {/* Agency Name */}
      <div className="space-y-1">
        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
          Agency Name (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Ojo Premium Realty"
          value={agentRegAgency}
          onChange={(e) => setAgentRegAgency(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none text-slate-850 font-semibold mt-1.5"
        />
      </div>

      {/* Operating Area */}
      <div className="space-y-1">
        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
          Primary Operating Area
        </label>
        <div className="relative mt-1.5">
          <select
            required
            value={agentRegArea}
            onChange={(e) => setAgentRegArea(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none text-slate-700 font-semibold cursor-pointer appearance-none pr-10"
          >
            <option value="">Select Area</option>
            <option value="Iyana-Iba">Iyana-Iba Area</option>
            <option value="Ojo Axis">Ojo Road / Alaba</option>
            <option value="Okokomaiko">Okokomaiko Area</option>
            <option value="Igando">Igando / Iba Axis</option>
            <option value="PPL">PPL / LASU Gate</option>
          </select>
          <ChevronDown className="absolute right-4 top-3 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* License NIN document uploader */}
      <div className="space-y-1.5 pt-2">
        <div
          onClick={() => setAgentRegUploadDoc("LASU_Housing_License.pdf")}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50/50 hover:border-purple-400 transition-colors flex flex-col justify-center items-center gap-2 ${
            agentRegUploadDoc
              ? "border-purple-500 bg-purple-50/20"
              : "border-slate-200"
          }`}
        >
          <UploadCloud
            className={`h-8 w-8 ${agentRegUploadDoc ? "text-purple-650 animate-pulse" : "text-slate-400"}`}
          />

          {agentRegUploadDoc ? (
            <div>
              <span className="text-xs font-bold text-slate-800">
                {agentRegUploadDoc}
              </span>
              <span className="block text-[10px] text-emerald-600 font-extrabold mt-0.5">
                ✓ Upload Completed
              </span>
            </div>
          ) : (
            <div>
              <span className="block text-xs font-bold text-purple-650 hover:text-purple-800 transition">
                Upload Verification Documents
              </span>
              <span className="block text-[10px] text-slate-400 font-semibold mt-1">
                Valid Government ID, NIN, or Agency License (PDF/JPG)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 pt-3">
        <label className="flex items-start gap-3 cursor-pointer group text-left select-none">
          <input
            type="checkbox"
            checked={agentAgreeTerms}
            onChange={() => setAgentAgreeTerms(!agentAgreeTerms)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
              agentAgreeTerms
                ? "bg-purple-600 border-purple-600 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {agentAgreeTerms && <Check className="h-3.5 w-3.5 stroke-3" />}
          </div>
          <span className="text-xs font-semibold text-slate-655 group-hover:text-slate-900 transition leading-snug">
            I agree to the{" "}
            <span className="text-purple-600 font-bold">
              Agent Terms of Service
            </span>{" "}
            and the platform&apos;s code of conduct for student safety.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group text-left select-none">
          <input
            type="checkbox"
            checked={agentAgreeAccurate}
            onChange={() => setAgentAgreeAccurate(!agentAgreeAccurate)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
              agentAgreeAccurate
                ? "bg-purple-600 border-purple-600 text-white"
                : "border-slate-300 bg-white"
            }`}
          >
            {agentAgreeAccurate && <Check className="h-3.5 w-3.5 stroke-3" />}
          </div>
          <span className="text-xs font-semibold text-slate-655 group-hover:text-slate-900 transition leading-snug">
            I confirm that all properties I list will be accurately represented
            and available for physical inspection.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold py-4 rounded-xl text-sm shadow-md shadow-purple-600/10 transition mt-4"
      >
        Complete Registration
      </button>

      {onToggleLogin && (
        <div className="text-center pt-2">
          <span className="text-xs text-slate-500 font-semibold">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggleLogin}
              className="text-purple-600 font-bold hover:text-purple-800"
            >
              Login here
            </button>
          </span>
        </div>
      )}
    </form>
  );
}
