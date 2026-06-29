"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="space-y-4 text-left">
          <h3 className="text-sm font-black text-white">LASU Accommodate</h3>
          <p className="leading-relaxed">
            Designed and built for Lagos State University (LASU) students. Making off-campus student accommodation searches and flatmate sharing around Ojo simple and verified.
          </p>
        </div>
        <div className="space-y-4 text-left">
          <h3 className="text-sm font-black text-white">Quick Links</h3>
          <ul className="space-y-2 font-semibold">
            <li><span className="cursor-pointer hover:text-white transition">Agent Registration</span></li>
            <li><span className="cursor-pointer hover:text-white transition">LASU Campus Map</span></li>
            <li><span className="cursor-pointer hover:text-white transition">Safety Guidelines</span></li>
            <li><span className="cursor-pointer hover:text-white transition">Terms & Conditions</span></li>
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
  );
}
