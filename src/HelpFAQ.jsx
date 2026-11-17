// import { useState } from "react";
// import { Link } from "react-router-dom";
// import Navbar from "./Navbar.jsx";
// import Footer from "./Footer.jsx";

// // Shared style for orange buttons
// const orange = "bg-[#FF8A00] text-white font-semibold";

// // FAQ list. Each item has a category, a question and an answer
// const faqs = [
//   { cat: "Account", q: "How do I create an account?", a: "Click Sign Up in the menu, enter your name, email and a password of at least 8 characters, then press Create Account. After that you can log in." },
//   { cat: "Account", q: "I forgot my password. What should I do?", a: "Open the Login page and click Forgot Password. Enter your registered email and then choose a new password." },
//   { cat: "Account", q: "How can I change my password?", a: "Go to Settings > Password. Enter your current password and the new one, then press Update Password." },
//   { cat: "Account", q: "How do I delete my account?", a: "Go to Settings > Delete Account and confirm. This removes your profile and login and cannot be undone." },
//   { cat: "Jobs", q: "How do I find jobs that match me?", a: "Use the Find Jobs page. You can search by title, location and category, and narrow results with the Job Type, Experience and Salary filters." },
//   { cat: "Jobs", q: "What do the job types mean?", a: "Full Time and Part Time are regular roles, Internship is a short learning role with a monthly stipend, and Freelance is project based work." },
//   { cat: "Applications", q: "How do I apply for a job?", a: "Log in, open Find Jobs and press Apply Now on the job you like. The button changes to Applied once your application is sent." },
//   { cat: "Applications", q: "Why does Apply Now open the Login page?", a: "You need to be logged in to apply. Log in or sign up first, then come back and apply." },
//   { cat: "Profile", q: "How do I update my profile?", a: "Open Profile from the menu, edit your name, phone, location, skills or experience and press Save Changes." },
//   { cat: "Profile", q: "Can I change my email address?", a: "Yes. Change it on the Profile page and save. The email must not already be used by another account." },
// ];

// const categories = ["All", "Account", "Jobs", "Applications", "Profile"];

// // Animations used on this page
// const animations = `
//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(24px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes popIn {
//     from { opacity: 0; transform: scale(0.9); }
//     to   { opacity: 1; transform: scale(1); }
//   }
//   @keyframes twinkle {
//     0%, 100% { opacity: 0.05; }
//     50%      { opacity: 1; }
//   }
//   .star { position: absolute; border-radius: 9999px; background: #fff; animation: twinkle ease-in-out infinite; }
//   @media (prefers-reduced-motion: reduce) { .star { animation: none; opacity: 0.6; } }
//   .anim-fade-up { animation: fadeUp 0.5s ease both; }
//   .anim-pop     { animation: popIn 0.35s ease both; }
// `;

// export default function HelpFAQ() {
//   const [category, setCategory] = useState("All");
//   const [search, setSearch] = useState("");
//   const [openIndex, setOpenIndex] = useState(0); // which answer is open (one at a time)

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

//   // Show only the questions that match the category and the search text
//   const text = search.trim().toLowerCase();
//   const visible = faqs.filter(
//     (f) =>
//       (category === "All" || f.cat === category) &&
//       (!text || f.q.toLowerCase().includes(text) || f.a.toLowerCase().includes(text))
//   );

//   return (
//     <div className="font-sans text-gray-800 min-h-screen flex flex-col bg-[#05060F]">
//       <style>{animations}</style>

//       {/* Navbar */}
//       <Navbar />

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

//         <div className="relative z-10 max-w-[900px] mx-auto">
//           {/* Search */}
//           <input
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
//             placeholder="Search for a question..."
//             className="anim-fade-up w-full h-14 px-5 bg-[#0B0D1A] text-gray-200 placeholder-gray-500 border border-white/10 rounded-xl outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/40 transition"
//           />

//           {/* Category tabs */}
//           <div className="flex flex-wrap gap-3 mt-6">
//             {categories.map((c, i) => (
//               <button
//                 key={c}
//                 onClick={() => { setCategory(c); setOpenIndex(null); }}
//                 style={{ animationDelay: `${i * 70}ms` }}
//                 className={`anim-fade-up px-6 py-2 rounded-full border transition duration-300 hover:-translate-y-0.5 active:scale-95 ${
//                   category === c
//                     ? "bg-[#FF8A00] text-white border-[#FF8A00] font-semibold scale-105"
//                     : "bg-[#0B0D1A] text-gray-300 border-white/10 hover:text-[#FF8A00] hover:border-[#FF8A00]/50"
//                 }`}
//               >
//                 {c}
//               </button>
//             ))}
//           </div>

//           {/* Questions (key changes with the filters so they animate again) */}
//           <div key={`${category}-${text}`} className="mt-8 space-y-3">
//             {visible.length === 0 && (
//               <div className="anim-pop bg-[#0B0D1A] border border-white/10 rounded-xl p-10 text-center text-gray-400">
//                 No questions found. Try a different word.
//               </div>
//             )}

//             {visible.map((f, i) => {
//               const open = openIndex === i;
//               return (
//                 <div
//                   key={f.q}
//                   style={{ animationDelay: `${i * 70}ms` }}
//                   className={`anim-fade-up bg-[#0B0D1A] border rounded-xl transition duration-300 hover:-translate-y-0.5 ${
//                     open ? "border-[#FF8A00]/50 shadow-lg" : "border-white/10 hover:border-[#FF8A00]/30"
//                   }`}
//                 >
//                   <button
//                     onClick={() => setOpenIndex(open ? null : i)}
//                     aria-expanded={open}
//                     className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
//                   >
//                     <span className={`font-semibold text-lg transition-colors ${open ? "text-[#FF8A00]" : "text-white"}`}>{f.q}</span>
//                     {/* The + turns into a x when open */}
//                     <span className={`text-2xl text-[#FF8A00] shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
//                   </button>

//                   {/* Answer slides open and closed */}
//                   <div
//                     className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
//                       open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
//                     }`}
//                   >
//                     <div className="overflow-hidden">
//                       <p className="px-6 pb-6 text-gray-400 leading-7">{f.a}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Still need help */}
//           <div className="anim-fade-up bg-[#0B0D1A] border border-[#FF8A00]/40 text-white rounded-xl p-10 mt-12 text-center">
//             <h3 className="text-2xl font-bold">Still need help?</h3>
//             <p className="text-gray-300 mt-2">Our support team is happy to help you.</p>
//             <div className="flex justify-center gap-4 mt-6">
//               <Link to="/messages" className={`${orange} px-8 py-3 rounded-full transition hover:brightness-110 hover:scale-105 active:scale-95`}>
//                 Send a Message
//               </Link>
//               <a
//                 href="#"
//                 className="border border-white px-8 py-3 rounded-full transition hover:bg-white hover:text-[#05060F] hover:scale-105 active:scale-95"
//               >
//                 Contact Us
//               </a>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }







import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const faqs = [
  { cat: "Account", q: "How do I create an account?", a: "Click Sign Up in the menu, enter your name, email and password, then press Create Account." },
  { cat: "Account", q: "I forgot my password. What should I do?", a: "Open the Login page and click Forgot Password. Enter your registered email and choose a new password." },
  { cat: "Account", q: "How can I change my password?", a: "Go to Settings > Password. Enter your current password and new password, then press Update Password." },
  { cat: "Account", q: "How do I delete my account?", a: "Go to Settings > Delete Account and confirm your request." },
  { cat: "Jobs", q: "How do I find jobs that match me?", a: "Use the Find Jobs page. Search by job title, location and category." },
  { cat: "Jobs", q: "What do the job types mean?", a: "Full Time, Part Time, Internship and Freelance are different types of job opportunities." },
  { cat: "Applications", q: "How do I apply for a job?", a: "Log in, open Find Jobs and click Apply Now on your preferred job." },
  { cat: "Applications", q: "Why does Apply Now open the Login page?", a: "You must log in before applying for a job." },
  { cat: "Profile", q: "How do I update my profile?", a: "Open Profile, edit your details and click Save Changes." },
  { cat: "Profile", q: "Can I change my email address?", a: "Yes, you can update your email from the Profile page." },
];

const categories = ["All", "Account", "Jobs", "Applications", "Profile"];

export default function HelpFAQ() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const visible = faqs.filter((f) => {
    const matchCategory =
      category === "All" || f.cat === category;

    const matchSearch =
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />

      <main className="flex-1 px-4 md:px-10 py-12">

        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              Help & FAQ
            </h1>

            <p className="text-gray-500 mt-2">
              Find answers to your questions.
            </p>
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenIndex(null);
            }}
            placeholder="Search for a question..."
            className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500"
          />

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mt-6">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setOpenIndex(0);
                }}
                className={`px-5 py-2 rounded-lg border transition ${
                  category === c
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-500"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* FAQ Questions */}
          <div className="mt-8 space-y-3">

            {visible.length === 0 && (
              <div className="bg-white p-8 rounded-lg text-center text-gray-500">
                No questions found.
              </div>
            )}

            {visible.map((f, i) => {
              const isOpen = openIndex === i;

              return (
                <div
                  key={f.q}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : i)
                    }
                    className="w-full flex items-center justify-between text-left p-5 hover:bg-orange-50 transition"
                  >
                    <span className="font-semibold">
                      {f.q}
                    </span>

                    <span className="text-orange-500 text-2xl">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-gray-500 leading-7 border-t border-gray-100 pt-4">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}

          </div>

          {/* Contact Support */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 mt-10 text-center">

            <h2 className="text-2xl font-bold">
              Still need help?
            </h2>

            <p className="text-gray-500 mt-2">
              Our support team is happy to help you.
            </p>

            <Link
              to="/messages"
              className="inline-block mt-5 px-7 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Send a Message
            </Link>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
