"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, MessageSquare, ArrowRight, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ChatDrawer() {
  const {
    activeChat,
    setActiveChat,
    chatMessages,
    sendMessage,
    showInbox,
    setShowInbox,
    matchesList,
    properties,
  } = useApp();

  const [activeMessageInput, setActiveMessageInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeChat]);

  // If both inbox is closed and no active chat is open, render nothing
  if (!showInbox && !activeChat) return null;

  const handleSend = () => {
    if (!activeMessageInput.trim()) return;
    sendMessage(activeChat.id, activeMessageInput);
    setActiveMessageInput("");
  };

  // Compile Inbox Conversations list
  const conversationPartners = Object.keys(chatMessages || {})
    .map((partnerId) => {
      // Check if matched roommate
      const matchedMate = matchesList.find((m) => m.id === partnerId);

      let name = partnerId;
      let avatar =
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";
      let role = "LASU Student";

      if (matchedMate) {
        name = matchedMate.name;
        avatar = matchedMate.avatar;
        role = `${matchedMate.department} (${matchedMate.yearOfStudy})`;
      } else {
        // Find agent
        const matchedProp = properties.find((p) => p.agent.name === partnerId);
        if (matchedProp) {
          name = matchedProp.agent.name;
          avatar = matchedProp.agent.avatar;
          role = `Agent at ${matchedProp.agent.agency}`;
        }
      }

      const msgs = chatMessages[partnerId] || [];
      const lastMsg = msgs[msgs.length - 1];

      return {
        id: partnerId,
        name,
        avatar,
        role,
        lastMessage: lastMsg ? lastMsg.content : "No messages yet",
        timestamp: lastMsg ? lastMsg.timestamp : new Date(),
        isMe: lastMsg ? lastMsg.senderId === "student-user" : false,
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleConversationClick = (partner) => {
    setActiveChat({
      id: partner.id,
      name: partner.name,
      avatar: partner.avatar,
      role: partner.role,
      listingTitle: partner.role.includes("Agent")
        ? "Agent Chat"
        : "Roommate Match",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left relative border-l border-slate-200 select-none">
        {/* RENDER INBOX CONVERSATIONS LIST (if activeChat is null) */}
        {!activeChat ? (
          <>
            {/* Inbox Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 text-left">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-650" />
                <h3 className="font-extrabold text-slate-805 text-base">
                  Your Inbox
                </h3>
              </div>
              <button
                onClick={() => setShowInbox(false)}
                className="h-8 w-8 bg-white border rounded-full flex items-center justify-center text-slate-550 transition hover:bg-slate-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Inbox Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {conversationPartners.length > 0 ? (
                conversationPartners.map((partner) => (
                  <div
                    key={partner.id}
                    onClick={() => handleConversationClick(partner)}
                    className="p-4 bg-slate-50 hover:bg-purple-50/50 border border-slate-100 hover:border-purple-200 rounded-2xl cursor-pointer transition duration-150 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 text-left min-w-0 flex-1">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-12 h-12 rounded-full object-cover border shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-purple-600 transition">
                          {partner.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-extrabold tracking-wide truncate">
                          {partner.role}
                        </p>
                        <p className="text-xs text-slate-500 font-semibold truncate mt-1">
                          {partner.isMe ? "You: " : ""}
                          {partner.lastMessage}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-650 group-hover:translate-x-1 transition ml-2 shrink-0" />
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-3">
                  <MessageSquare className="h-10 w-10 text-slate-300" />
                  <p className="text-xs text-slate-400 font-bold max-w-[200px]">
                    Your inbox is empty. Swipe right on roommates or click
                    &quot;Chat Agent&quot; on listings to start conversations!
                  </p>
                </div>
              )}
            </div>

            {/* Inbox Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-405 font-bold mb-16 md:mb-0">
              ⚡ LASU Accommodate Student Messaging Hub
            </div>
          </>
        ) : (
          /* RENDER CHAT THREAD (if activeChat is set) */
          <>
            {/* Thread Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3 text-left">
                {showInbox && (
                  <button
                    onClick={() => setActiveChat(null)}
                    className="mr-1 h-8 px-2.5 border rounded-lg bg-white hover:bg-slate-50 text-[10px] font-black uppercase text-purple-600 tracking-wider transition active:scale-95 shadow-sm"
                  >
                    ← Back
                  </button>
                )}
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-205"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {activeChat.name}
                  </h3>
                  <p className="text-[10px] text-slate-550 font-semibold">
                    {activeChat.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveChat(null);
                  setShowInbox(false);
                }}
                className="h-8 w-8 bg-white border rounded-full flex items-center justify-center text-slate-550 transition hover:bg-slate-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Message bubbles list */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/40 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[10px] font-bold text-amber-700 text-left">
                ⚠️ Avoid paying agent fees upfront before physically inspecting
                student listings around Ojo.
              </div>

              {chatMessages[activeChat.id] &&
                chatMessages[activeChat.id].map((msg) => {
                  const isMe = msg.senderId === "student-user";
                  const isSys = msg.senderId === "system";
                  if (isSys) {
                    return (
                      <div key={msg.id} className="text-center py-1">
                        <span className="inline-block bg-purple-50 text-purple-855 text-[10px] font-extrabold px-3 py-1 rounded-full border border-purple-100">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-3.5 text-xs font-semibold text-left shadow-sm ${
                          isMe
                            ? "bg-purple-600 text-white rounded-br-none"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.content}</p>
                        <span
                          className={`block text-[8px] mt-1.5 text-right font-semibold ${isMe ? "text-purple-200" : "text-slate-450"}`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-slate-100 flex items-center gap-2 bg-white mb-16 md:mb-0">
              <input
                type="text"
                placeholder="Type a message..."
                value={activeMessageInput}
                onChange={(e) => setActiveMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-purple-600 focus:bg-white text-slate-800 font-semibold"
              />
              <button
                onClick={handleSend}
                className="bg-purple-600 text-white p-3 rounded-xl shadow-md active:scale-95 transition hover:bg-purple-700"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
