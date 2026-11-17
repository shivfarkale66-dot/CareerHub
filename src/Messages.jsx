// import { useEffect, useRef, useState } from "react";
// import { Navigate } from "react-router-dom";
// import Navbar from "./Navbar.jsx";
// import Footer from "./Footer.jsx";

// // Shared style for orange buttons
// const orange = "bg-[#FF8A00] text-white font-semibold";

// // Biggest file the user can send (files are saved in localStorage, so keep it small)
// const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

// // Sample conversations (used the first time, then saved in localStorage)
// const seedChats = [
//   {
//     id: 1, name: "Pixel Studio", role: "HR Team • Bhopal", color: "bg-emerald-500",
//     messages: [
//       { from: "them", text: "Hi! Thanks for applying for the UI/UX Designer role.", time: "10:02 AM" },
//       { from: "them", text: "Can you share your portfolio link?", time: "10:03 AM" },
//     ],
//   },
//   {
//     id: 2, name: "TechNova", role: "Recruiter • Indore", color: "bg-[#FF8A00]",
//     messages: [
//       { from: "them", text: "Your React experience looks great. Are you free for a call tomorrow?", time: "Yesterday" },
//     ],
//   },
//   {
//     id: 3, name: "BrandLoop", role: "Hiring Manager • Remote", color: "bg-violet-500",
//     messages: [
//       { from: "them", text: "We have moved your application to the next round.", time: "Mon" },
//     ],
//   },
//   {
//     id: 4, name: "InsightIQ", role: "HR Team • Pune", color: "bg-red-500",
//     messages: [
//       { from: "them", text: "Please confirm your joining date for the internship.", time: "Sun" },
//     ],
//   },
// ];

// // Animations used on this page
// const animations = `
//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(24px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes fadeLeft {
//     from { opacity: 0; transform: translateX(-30px); }
//     to   { opacity: 1; transform: translateX(0); }
//   }
//   @keyframes popIn {
//     from { opacity: 0; transform: scale(0.9); }
//     to   { opacity: 1; transform: scale(1); }
//   }
//   @keyframes twinkle {
//     0%, 100% { opacity: 0.05; }
//     50%      { opacity: 1; }
//   }
//   @keyframes typingDot {
//     0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
//     40%           { opacity: 1;    transform: translateY(-4px); }
//   }
//   .star { position: absolute; border-radius: 9999px; background: #fff; animation: twinkle ease-in-out infinite; }
//   .typing-dot { width: 7px; height: 7px; border-radius: 9999px; background: #9CA3AF; animation: typingDot 1.2s ease-in-out infinite; }
//   .anim-fade-up   { animation: fadeUp 0.5s ease both; }
//   .anim-fade-left { animation: fadeLeft 0.6s ease both; }
//   .anim-pop       { animation: popIn 0.3s ease both; }
//   @media (prefers-reduced-motion: reduce) { .star { animation: none; opacity: 0.6; } }
// `;

// // Read the logged in user from localStorage (null if nobody is logged in)
// function getLoggedInUser() {
//   try {
//     return JSON.parse(localStorage.getItem("loggedInUser"));
//   } catch {
//     return null;
//   }
// }

// // Read saved chats, or use the sample chats
// function getChats() {
//   try {
//     return JSON.parse(localStorage.getItem("chats")) || seedChats;
//   } catch {
//     return seedChats;
//   }
// }

// const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// // 2048 -> "2 KB"
// const fileSize = (bytes) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

// // Short text shown in the chat list for the last message
// const preview = (m) => (m?.type === "file" ? `📎 ${m.name}` : m?.text);

// export default function Messages() {
//   const [user] = useState(getLoggedInUser());
//   const [chats, setChats] = useState(getChats());
//   const [activeId, setActiveId] = useState(1);
//   const [draft, setDraft] = useState("");
//   const [search, setSearch] = useState("");
//   const [typingId, setTypingId] = useState(null); // chat where the company is "typing"
//   const [error, setError] = useState("");

//   const messagesRef = useRef(null); // the scrolling message box
//   const fileRef = useRef(null); // hidden file input
//   const chatsRef = useRef(chats); // always the newest chats (timers use this)
//   const timers = useRef([]);

//   // Small star dots for the dark background (created once, each blinks at its own speed)
//   const [stars] = useState(() =>
//     Array.from({ length: 50 }, (_, i) => ({
//       id: i,
//       top: Math.random() * 100,
//       left: Math.random() * 100,
//       size: Math.random() < 0.2 ? 3 : 2,
//       duration: 2 + Math.random() * 4,
//       delay: Math.random() * 5,
//     }))
//   );

//   const active = chats.find((c) => c.id === activeId);

//   // When the page opens, start from the top
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // Stop the pending auto replies when the page closes
//   useEffect(() => {
//     const list = timers.current;
//     return () => list.forEach(clearTimeout);
//   }, []);

//   // Scroll only the message box to the newest message.
//   // (scrollIntoView also scrolled the whole page down, that was the jump)
//   useEffect(() => {
//     const box = messagesRef.current;
//     if (box) box.scrollTop = box.scrollHeight;
//   }, [activeId, active?.messages.length, typingId]);

//   // Messages is only for logged in users
//   if (!user) return <Navigate to="/login" replace />;

//   // Save + show the new chats. Returns false if the browser storage is full.
//   const commit = (updated) => {
//     try {
//       localStorage.setItem("chats", JSON.stringify(updated));
//     } catch {
//       return false;
//     }
//     chatsRef.current = updated;
//     setChats(updated);
//     return true;
//   };

//   // Add one message to a chat. "flags" are extra chat fields (resumeAsked, resumeSent)
//   const pushMessage = (chatId, msg, flags = {}) =>
//     commit(
//       chatsRef.current.map((c) =>
//         c.id === chatId ? { ...c, ...flags, messages: [...c.messages, msg] } : c
//       )
//     );

//   // The company "types" for a moment, then sends its message
//   const companyReply = (chatId, msg, flags = {}, delay = 1400) => {
//     setTypingId(chatId);
//     const t = setTimeout(() => {
//       setTypingId((cur) => (cur === chatId ? null : cur));
//       pushMessage(chatId, { from: "them", time: nowTime(), ...msg }, flags);
//     }, delay);
//     timers.current.push(t);
//   };

//   // Send the typed message. The first time, the company asks for the resume.
//   const handleSend = (e) => {
//     e.preventDefault();
//     const text = draft.trim();
//     if (!text) return;

//     const chat = chatsRef.current.find((c) => c.id === activeId);
//     const askNow = !chat.resumeAsked;

//     const ok = pushMessage(activeId, { from: "me", text, time: nowTime() }, askNow ? { resumeAsked: true } : {});
//     if (!ok) {
//       setError("Storage is full. Could not send the message.");
//       return;
//     }
//     setError("");
//     setDraft("");

//     if (askNow) {
//       companyReply(activeId, {
//         type: "resume-request",
//         text: "Thanks for your message! Please send us your resume so we can move forward.",
//       });
//     }
//   };

//   // User picked a file (resume or any document)
//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = ""; // so the same file can be chosen again
//     if (!file) return;

//     if (file.size > MAX_FILE_SIZE) {
//       setError("File is too big. Please choose a file under 1 MB.");
//       return;
//     }

//     const chatId = activeId;
//     const reader = new FileReader();
//     reader.onerror = () => setError("Could not read this file. Try another one.");
//     reader.onload = () => {
//       const chat = chatsRef.current.find((c) => c.id === chatId);
//       const isResume = chat.resumeAsked && !chat.resumeSent;

//       const ok = pushMessage(
//         chatId,
//         { from: "me", type: "file", name: file.name, size: file.size, data: reader.result, time: nowTime() },
//         isResume ? { resumeSent: true } : {}
//       );
//       if (!ok) {
//         setError("Storage is full. Could not send this file.");
//         return;
//       }
//       setError("");

//       if (isResume) {
//         companyReply(chatId, {
//           text: "Thank you! We have received your resume. Our team will review it and get back to you soon.",
//         });
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   // Filter the left list by name
//   const visibleChats = chats.filter((c) =>
//     c.name.toLowerCase().includes(search.trim().toLowerCase())
//   );

//   return (
//     <div className="font-sans text-gray-800 min-h-screen flex flex-col bg-[#05060F]">
//       <style>{animations}</style>

//       {/* Navbar */}
//       <Navbar />

//       {/* Chat list + conversation */}
//       <main className="relative overflow-hidden flex-1 bg-[#05060F] text-white py-12 px-6 md:px-28">
//         {/* Blinking stars (behind everything) */}
//         <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
//           {stars.map((s) => (
//             <span
//               key={s.id}
//               className="star"
//               style={{
//                 top: `${s.top}%`,
//                 left: `${s.left}%`,
//                 width: s.size,
//                 height: s.size,
//                 animationDuration: `${s.duration}s`,
//                 animationDelay: `${s.delay}s`,
//               }}
//             />
//           ))}
//         </div>

//         <div className="relative z-10 grid lg:grid-cols-[350px_1fr] gap-6 items-start">
//           {/* Conversation list */}
//           <aside className="anim-fade-left bg-[#0B0D1A] border border-white/10 rounded-xl p-5 lg:h-[620px] flex flex-col">
//             <h3 className="text-2xl font-bold">Chats</h3>
//             <span className="block w-9 h-[3px] bg-[#FF8A00] mt-2 mb-5" />

//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search chats"
//               className="w-full h-12 px-4 bg-[#0B0D1A] text-gray-200 placeholder-gray-500 border border-white/10 rounded-lg outline-none focus:border-[#FF8A00] transition"
//             />

//             <div className="mt-4 space-y-1 overflow-y-auto">
//               {visibleChats.length === 0 && (
//                 <p className="text-sm text-gray-400 p-3">No chats found.</p>
//               )}

//               {visibleChats.map((c, i) => {
//                 const last = c.messages[c.messages.length - 1];
//                 return (
//                   <button
//                     key={c.id}
//                     onClick={() => { setActiveId(c.id); setError(""); }}
//                     style={{ animationDelay: `${i * 80}ms` }}
//                     className={`anim-fade-up w-full flex items-center gap-3 p-3 rounded-lg text-left transition duration-300 hover:translate-x-1 ${
//                       activeId === c.id ? "bg-[#FF8A00]/15 border border-[#FF8A00]/40" : "border border-transparent hover:bg-white/5"
//                     }`}
//                   >
//                     <div className={`${c.color} w-12 h-12 rounded-full grid place-items-center text-white text-xl font-bold shrink-0`}>
//                       {c.name[0]}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <div className="flex items-center justify-between gap-2">
//                         <span className="font-semibold">{c.name}</span>
//                         <span className="text-xs text-gray-500 shrink-0">{last?.time}</span>
//                       </div>
//                       <p className="text-sm text-gray-400 truncate">
//                         {typingId === c.id ? "typing..." : preview(last)}
//                       </p>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </aside>

//           {/* Conversation */}
//           <section className="anim-fade-up bg-[#0B0D1A] border border-white/10 rounded-xl flex flex-col h-[620px]">
//             {active ? (
//               <>
//                 {/* Chat header */}
//                 <div className="flex items-center gap-4 p-5 border-b border-white/10">
//                   <div className={`${active.color} w-12 h-12 rounded-full grid place-items-center text-white text-xl font-bold`}>
//                     {active.name[0]}
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-lg">{active.name}</h3>
//                     <p className="text-sm text-gray-400">
//                       {typingId === active.id ? "typing..." : active.role}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Messages (key changes per chat, so messages animate when you switch) */}
//                 <div
//                   key={active.id}
//                   ref={messagesRef}
//                   className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#080A16]"
//                 >
//                   {active.messages.map((m, i) => (
//                     <div
//                       key={i}
//                       style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
//                       className={`anim-pop flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
//                     >
//                       <div
//                         className={`max-w-[75%] px-5 py-3 rounded-2xl ${
//                           m.from === "me"
//                             ? "bg-[#FF8A00] text-white rounded-br-sm"
//                             : "bg-white/10 text-gray-100 rounded-bl-sm"
//                         }`}
//                       >
//                         {/* A file the user sent */}
//                         {m.type === "file" ? (
//                           <a
//                             href={m.data}
//                             download={m.name}
//                             className="flex items-center gap-3 hover:opacity-90"
//                             title="Download"
//                           >
//                             <span className="w-11 h-11 rounded-lg bg-white/25 grid place-items-center text-xl shrink-0">📄</span>
//                             <span className="min-w-0">
//                               <span className="block font-semibold truncate max-w-[200px]">{m.name}</span>
//                               <span className="block text-xs text-orange-100">{fileSize(m.size)} • Tap to download</span>
//                             </span>
//                           </a>
//                         ) : (
//                           <p>{m.text}</p>
//                         )}

//                         {/* Resume request: button to send the file */}
//                         {m.type === "resume-request" && (
//                           active.resumeSent ? (
//                             <p className="mt-3 text-sm font-semibold text-green-400">✓ Resume sent</p>
//                           ) : (
//                             <button
//                               type="button"
//                               onClick={() => fileRef.current?.click()}
//                               className={`${orange} mt-3 px-5 py-2 rounded-full text-sm transition hover:brightness-110 hover:scale-105 active:scale-95`}
//                             >
//                               📎 Send Resume
//                             </button>
//                           )
//                         )}

//                         <p className={`text-xs mt-1 ${m.from === "me" ? "text-orange-100" : "text-gray-400"}`}>
//                           {m.time}
//                         </p>
//                       </div>
//                     </div>
//                   ))}

//                   {/* "typing..." dots while the company is writing */}
//                   {typingId === active.id && (
//                     <div className="anim-pop flex justify-start">
//                       <div className="bg-white/10 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-1.5">
//                         <span className="typing-dot" />
//                         <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
//                         <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Error text */}
//                 {error && <p key={error} className="anim-pop px-5 pt-3 text-sm text-red-400">{error}</p>}

//                 {/* Message box (the clip button sends any file) */}
//                 <form onSubmit={handleSend} className="flex gap-3 p-5 border-t border-white/10">
//                   <input
//                     ref={fileRef}
//                     type="file"
//                     accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
//                     onChange={handleFile}
//                     className="hidden"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => fileRef.current?.click()}
//                     aria-label="Attach a file"
//                     title="Attach a file"
//                     className="w-14 h-14 shrink-0 rounded-lg border border-white/10 bg-[#0B0D1A] text-xl transition hover:border-[#FF8A00] hover:scale-105 active:scale-95"
//                   >
//                     📎
//                   </button>
//                   <input
//                     value={draft}
//                     onChange={(e) => setDraft(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 h-14 px-5 bg-[#0B0D1A] text-gray-200 placeholder-gray-500 border border-white/10 rounded-lg outline-none focus:border-[#FF8A00] transition"
//                   />
//                   <button type="submit" className={`${orange} px-8 rounded-lg transition hover:brightness-110 hover:scale-105 active:scale-95`}>
//                     Send
//                   </button>
//                 </form>
//               </>
//             ) : (
//               <p className="m-auto text-gray-400">Select a chat to start messaging.</p>
//             )}
//           </section>
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }












import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const MAX_FILE_SIZE = 1024 * 1024;

const seedChats = [
  {
    id: 1,
    name: "Pixel Studio",
    role: "HR Team • Bhopal",
    color: "bg-green-500",
    messages: [
      {
        from: "them",
        text: "Hi! Thanks for applying for the UI/UX Designer role.",
        time: "10:02 AM",
      },
      {
        from: "them",
        text: "Can you share your portfolio link?",
        time: "10:03 AM",
      },
    ],
  },
  {
    id: 2,
    name: "TechNova",
    role: "Recruiter • Indore",
    color: "bg-orange-500",
    messages: [
      {
        from: "them",
        text: "Your React experience looks great. Are you free for a call tomorrow?",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 3,
    name: "BrandLoop",
    role: "Hiring Manager • Remote",
    color: "bg-purple-500",
    messages: [
      {
        from: "them",
        text: "We have moved your application to the next round.",
        time: "Monday",
      },
    ],
  },
  {
    id: 4,
    name: "InsightIQ",
    role: "HR Team • Pune",
    color: "bg-red-500",
    messages: [
      {
        from: "them",
        text: "Please confirm your joining date for the internship.",
        time: "Sunday",
      },
    ],
  },
];

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser"));
  } catch {
    return null;
  }
};

const getChats = () => {
  try {
    const saved = localStorage.getItem("chats");
    return saved ? JSON.parse(saved) : seedChats;
  } catch {
    return seedChats;
  }
};

const nowTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const fileSize = (bytes) =>
  `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default function Messages() {
  const [user] = useState(getUser);
  const [chats, setChats] = useState(getChats);
  const [activeId, setActiveId] = useState(1);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [typingId, setTypingId] = useState(null);

  const messagesRef = useRef(null);
  const fileRef = useRef(null);
  const chatsRef = useRef(chats);
  const timers = useRef([]);

  const active = chats.find((chat) => chat.id === activeId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    const box = messagesRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [activeId, active?.messages.length, typingId]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Save messages
  const commit = (updated) => {
    try {
      localStorage.setItem("chats", JSON.stringify(updated));
      chatsRef.current = updated;
      setChats(updated);
      return true;
    } catch {
      return false;
    }
  };

  // Add a message
  const pushMessage = (chatId, message, flags = {}) => {
    return commit(
      chatsRef.current.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              ...flags,
              messages: [...chat.messages, message],
            }
          : chat
      )
    );
  };

  // Automatic company reply
  const companyReply = (chatId, message, flags = {}) => {
    setTypingId(chatId);

    const timer = setTimeout(() => {
      setTypingId((current) =>
        current === chatId ? null : current
      );

      pushMessage(
        chatId,
        { from: "them", time: nowTime(), ...message },
        flags
      );
    }, 1200);

    timers.current.push(timer);
  };

  // Send message
  const handleSend = (e) => {
    e.preventDefault();

    const text = draft.trim();
    if (!text || !active) return;

    const chat = chatsRef.current.find(
      (c) => c.id === activeId
    );

    const askNow = !chat.resumeAsked;

    const success = pushMessage(
      activeId,
      {
        from: "me",
        text,
        time: nowTime(),
      },
      askNow ? { resumeAsked: true } : {}
    );

    if (!success) {
      setError("Storage is full. Could not send message.");
      return;
    }

    setDraft("");
    setError("");

    if (askNow) {
      companyReply(activeId, {
        type: "resume-request",
        text: "Thanks for your message! Please send us your resume.",
      });
    }
  };

  // Attach file or resume
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("Please choose a file under 1 MB.");
      return;
    }

    const chatId = activeId;
    const reader = new FileReader();

    reader.onerror = () => {
      setError("Could not read this file.");
    };

    reader.onload = () => {
      const chat = chatsRef.current.find(
        (c) => c.id === chatId
      );

      const isResume =
        chat.resumeAsked && !chat.resumeSent;

      const success = pushMessage(
        chatId,
        {
          from: "me",
          type: "file",
          name: file.name,
          size: file.size,
          data: reader.result,
          time: nowTime(),
        },
        isResume ? { resumeSent: true } : {}
      );

      if (!success) {
        setError("Storage is full. Could not send file.");
        return;
      }

      setError("");

      if (isResume) {
        companyReply(chatId, {
          text: "Thank you! We have received your resume. Our team will review it soon.",
        });
      }
    };

    reader.readAsDataURL(file);
  };

  // Search chats
  const visibleChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />

      <main className="flex-1 px-4 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold mb-2">
            Messages
          </h1>

          <p className="text-gray-500 mb-6">
            Connect with recruiters and companies.
          </p>

          <div className="grid lg:grid-cols-[320px_1fr] gap-5">

            {/* Chat Sidebar */}
            <aside className="bg-white rounded-xl border border-gray-200 overflow-hidden">

              <div className="p-5 border-b">
                <h2 className="text-xl font-semibold mb-4">
                  Chats
                </h2>

                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-orange-500"
                />
              </div>

              <div className="max-h-[520px] overflow-y-auto">

                {visibleChats.length === 0 && (
                  <p className="p-5 text-gray-500 text-sm">
                    No chats found.
                  </p>
                )}

                {visibleChats.map((chat) => {
                  const last =
                    chat.messages[chat.messages.length - 1];

                  return (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setActiveId(chat.id);
                        setError("");
                      }}
                      className={`w-full flex items-center gap-3 p-4 text-left border-b hover:bg-orange-50 transition ${
                        activeId === chat.id
                          ? "bg-orange-50 border-l-4 border-l-orange-500"
                          : ""
                      }`}
                    >
                      <div
                        className={`${chat.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg`}
                      >
                        {chat.name[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <h3 className="font-semibold truncate">
                            {chat.name}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {last?.time}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 truncate">
                          {typingId === chat.id
                            ? "Typing..."
                            : last?.type === "file"
                            ? `📎 ${last.name}`
                            : last?.text}
                        </p>
                      </div>
                    </button>
                  );
                })}

              </div>
            </aside>

            {/* Chat Window */}
            <section className="bg-white rounded-xl border border-gray-200 flex flex-col h-[600px]">

              {active ? (
                <>
                  {/* Header */}
                  <div className="p-5 border-b flex items-center gap-3">

                    <div
                      className={`${active.color} w-11 h-11 rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      {active.name[0]}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {active.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {active.role}
                      </p>
                    </div>

                  </div>

                  {/* Messages */}
                  <div
                    ref={messagesRef}
                    className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50"
                  >

                    {active.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.from === "me"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-3 rounded-xl ${
                            message.from === "me"
                              ? "bg-orange-500 text-white rounded-br-none"
                              : "bg-white border text-gray-700 rounded-bl-none"
                          }`}
                        >
                          {message.type === "file" ? (
                            <a
                              href={message.data}
                              download={message.name}
                              className="underline"
                            >
                              📎 {message.name}
                              <span className="block text-xs">
                                {fileSize(message.size)} • Download
                              </span>
                            </a>
                          ) : (
                            <p>{message.text}</p>
                          )}

                          {message.type === "resume-request" && (
                            active.resumeSent ? (
                              <p className="text-xs mt-2">
                                ✓ Resume sent
                              </p>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm"
                              >
                                📎 Send Resume
                              </button>
                            )
                          )}

                          <p
                            className={`text-xs mt-2 ${
                              message.from === "me"
                                ? "text-orange-100"
                                : "text-gray-400"
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}

                    {typingId === active.id && (
                      <p className="text-sm text-gray-400">
                        Typing...
                      </p>
                    )}

                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-red-500 text-sm px-4 pt-2">
                      {error}
                    </p>
                  )}

                  {/* Message Input */}
                  <form
                    onSubmit={handleSend}
                    className="p-4 border-t flex gap-3 items-center"
                  >

                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      onChange={handleFile}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-2xl text-gray-500 hover:text-orange-500"
                    >
                      📎
                    </button>

                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-orange-500"
                    />

                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
                    >
                      Send
                    </button>

                  </form>
                </>
              ) : (
                <p className="m-auto text-gray-500">
                  Select a chat to start messaging.
                </p>
              )}

            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
