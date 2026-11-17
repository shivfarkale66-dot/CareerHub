// import { useState } from "react";
// import { Link } from "react-router-dom";
// import Navbar from "./Navbar.jsx";
// import Footer from "./Footer.jsx";

// // Shared style for orange buttons
// const orange = "bg-[#FF8A00] text-white font-semibold";

// // Contact details shown on the left (replace with your real details)
// const info = [
//   ["Email", "support@careerhub.com"],
//   ["Phone", "+91 98765 43210"],
//   ["Address", "Bhopal, Madhya Pradesh, India"],
//   ["Working Hours", "Mon – Sat, 10:00 AM – 6:00 PM"],
// ];

// // Subject choices
// const subjects = ["General Question", "Account Help", "Jobs & Applications", "Feedback"];

// // Shared input style
// const inputClass =
//   "w-full h-14 px-5 bg-[#0B0D1A] text-gray-200 placeholder-gray-500 border border-white/10 rounded-lg outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/40 transition";

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
//   .star { position: absolute; border-radius: 9999px; background: #fff; animation: twinkle ease-in-out infinite; }
//   @media (prefers-reduced-motion: reduce) { .star { animation: none; opacity: 0.6; } }
//   .anim-fade-up   { animation: fadeUp 0.5s ease both; }
//   .anim-fade-left { animation: fadeLeft 0.6s ease both; }
//   .anim-pop       { animation: popIn 0.35s ease both; }
// `;

// // Read the logged in user from localStorage (null if nobody is logged in)
// function getLoggedInUser() {
//   try {
//     return JSON.parse(localStorage.getItem("loggedInUser"));
//   } catch {
//     return null;
//   }
// }

// export default function ContactUs() {
//   const [user] = useState(getLoggedInUser());

//   // If the user is logged in, fill name and email automatically
//   const [form, setForm] = useState({
//     name: user?.fullName || "",
//     email: user?.gmail || "",
//     subject: subjects[0],
//     message: "",
//   });
//   const [status, setStatus] = useState({ type: "", text: "" });

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

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setStatus({ type: "", text: "" });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (form.message.trim().length < 10) {
//       setStatus({ type: "error", text: "Please write at least 10 characters in your message." });
//       return;
//     }

//     // Save the message (demo only, no backend yet)
//     let saved = [];
//     try {
//       saved = JSON.parse(localStorage.getItem("contactMessages")) || [];
//     } catch {
//       saved = [];
//     }
//     saved.push({ ...form, date: new Date().toISOString() });
//     localStorage.setItem("contactMessages", JSON.stringify(saved));

//     setForm({ ...form, subject: subjects[0], message: "" });
//     setStatus({ type: "success", text: "Thank you! Your message has been sent. We will reply soon." });
//   };

//   return (
//     <div className="font-sans text-gray-800 min-h-screen flex flex-col bg-[#05060F]">
//       <style>{animations}</style>

//       {/* Navbar */}
//       <Navbar />

//       {/* Info + form */}
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

//         <div className="relative z-10 grid lg:grid-cols-[400px_1fr] gap-10 items-start">
//           {/* Contact details */}
//           <aside className="anim-fade-left bg-[#0B0D1A] border border-white/10 rounded-xl p-8">
//             <h3 className="text-2xl font-bold">Get in Touch</h3>
//             <span className="block w-9 h-[3px] bg-[#FF8A00] mt-2 mb-6" />
//             <p className="text-gray-400 leading-7">
//               Have a question or need help? Send us a message and our team will get back to you.
//             </p>

//             <div className="mt-6 space-y-5">
//               {info.map(([label, value], i) => (
//                 <div
//                   key={label}
//                   style={{ animationDelay: `${200 + i * 100}ms` }}
//                   className="anim-fade-up flex items-start gap-4 transition duration-300 hover:translate-x-1"
//                 >
//                   <span className="w-11 h-11 rounded-lg bg-[#FF8A00]/15 border border-[#FF8A00]/30 shrink-0" />
//                   <div>
//                     <p className="font-semibold">{label}</p>
//                     <p className="text-gray-400 text-sm mt-1">{value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <p className="text-sm text-gray-400 mt-8">
//               Looking for quick answers? Visit our{" "}
//               <Link to="/help" className="text-[#FF8A00] font-semibold hover:underline">Help / FAQ</Link> page.
//             </p>
//           </aside>

//           {/* Message form */}
//           <form onSubmit={handleSubmit} className="anim-fade-up bg-[#0B0D1A] border border-white/10 rounded-xl p-9">
//             <h2 className="text-3xl font-bold">Send a Message</h2>
//             <span className="block w-12 h-[3px] bg-[#FF8A00] mt-2 mb-8" />

//             <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
//               <div>
//                 <label htmlFor="name" className="block font-semibold text-sm mb-2">Your Name</label>
//                 <input id="name" name="name" required value={form.name} onChange={handleChange}
//                   placeholder="John Doe" className={inputClass} />
//               </div>
//               <div>
//                 <label htmlFor="email" className="block font-semibold text-sm mb-2">Email Address</label>
//                 <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
//                   placeholder="you@example.com" className={inputClass} />
//               </div>
//               <div className="md:col-span-2">
//                 <label htmlFor="subject" className="block font-semibold text-sm mb-2">Subject</label>
//                 <select id="subject" name="subject" value={form.subject} onChange={handleChange}
//                   className={inputClass}>
//                   {subjects.map((s) => <option key={s}>{s}</option>)}
//                 </select>
//               </div>
//               <div className="md:col-span-2">
//                 <label htmlFor="message" className="block font-semibold text-sm mb-2">Message</label>
//                 <textarea id="message" name="message" required rows={6} value={form.message} onChange={handleChange}
//                   placeholder="Write your message here..."
//                   className="w-full p-5 bg-[#0B0D1A] text-gray-200 placeholder-gray-500 border border-white/10 rounded-lg outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/40 transition resize-none" />
//               </div>
//             </div>

//             {/* Success / error text (pops in when it appears) */}
//             {status.text && (
//               <p
//                 key={status.text}
//                 className={`anim-pop mt-6 text-sm ${status.type === "error" ? "text-red-400" : "text-green-400"}`}
//               >
//                 {status.text}
//               </p>
//             )}

//             <button
//               type="submit"
//               className={`${orange} px-12 h-14 rounded-lg mt-8 transition hover:brightness-110 hover:-translate-y-0.5 active:scale-95`}
//             >
//               Send Message
//             </button>
//           </form>
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

const info = [
  ["✉️", "Email", "support@careerhub.com"],
  ["📞", "Phone", "+91 98765 43210"],
  ["📍", "Address", "Bhopal, Madhya Pradesh, India"],
  ["🕒", "Working Hours", "Mon – Sat, 10:00 AM – 6:00 PM"],
];

const subjects = [
  "General Question",
  "Account Help",
  "Jobs & Applications",
  "Feedback",
];

function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser"));
  } catch {
    return null;
  }
}

export default function ContactUs() {
  const [user] = useState(getLoggedInUser);

  const [form, setForm] = useState({
    name: user?.fullName || "",
    email: user?.gmail || "",
    subject: subjects[0],
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    text: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setStatus({ type: "", text: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.message.trim().length < 10) {
      setStatus({
        type: "error",
        text: "Please write at least 10 characters in your message.",
      });
      return;
    }

    let saved = [];

    try {
      saved =
        JSON.parse(localStorage.getItem("contactMessages")) || [];
    } catch {
      saved = [];
    }

    saved.push({
      ...form,
      date: new Date().toISOString(),
    });

    try {
      localStorage.setItem(
        "contactMessages",
        JSON.stringify(saved)
      );
    } catch {
      setStatus({
        type: "error",
        text: "Unable to save your message. Please try again.",
      });
      return;
    }

    setForm({
      ...form,
      subject: subjects[0],
      message: "",
    });

    setStatus({
      type: "success",
      text: "Thank you! Your message has been sent successfully.",
    });
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition bg-white";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">

      <Navbar />

      <main className="flex-1 px-4 md:px-10 py-12">

        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">
              Contact Us
            </h1>

            <p className="text-gray-500 mt-2">
              Have a question? We are here to help you.
            </p>
          </div>

          <div className="grid lg:grid-cols-[380px_1fr] gap-8">

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-7 h-fit">

              <h2 className="text-2xl font-bold">
                Get in Touch
              </h2>

              <p className="text-gray-500 mt-2 leading-6">
                Contact our support team for any questions
                related to CareerHub.
              </p>

              <div className="mt-8 space-y-7">

                {info.map(([icon, label, value]) => (
                  <div
                    key={label}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-xl shrink-0">
                      {icon}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {label}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}

              </div>

              <div className="mt-8 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Need quick answers?
                </p>

                <Link
                  to="/help"
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Visit Help & FAQ →
                </Link>
              </div>

            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-7">

              <h2 className="text-2xl font-bold">
                Send Us a Message
              </h2>

              <p className="text-gray-500 text-sm mt-2 mb-7">
                Fill out the form below and our team will get back to you.
              </p>

              <form onSubmit={handleSubmit}>

                <div className="grid md:grid-cols-2 gap-5">

                  {/* Name */}
                  <div>
                    <label className="block font-medium mb-2">
                      Your Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={inputClass}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-medium mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={inputClass}
                    />
                  </div>

                  {/* Subject */}
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-2">
                      Subject
                    </label>

                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-2">
                      Your Message
                    </label>

                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                </div>

                {/* Status */}
                {status.text && (
                  <p
                    className={`mt-5 text-sm ${
                      status.type === "error"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {status.text}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="mt-6 px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
                >
                  Send Message
                </button>

              </form>

            </div>

          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
}
