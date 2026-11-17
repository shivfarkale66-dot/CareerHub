import { useState } from "react";
import { Link } from "react-router-dom";
import "./tailwind.css";

// Same orange button style as Home.jsx
const orange = "bg-[#FF8A00] text-white font-semibold";

const company = {
  name: "Pixel Studio",
  type: "Design Agency",
  city: "Bhopal, MP",
  size: "80+ employees",
  about:
    "Pixel Studio is a design-first agency building digital products for startups and enterprises. Our team of designers and engineers delivers brand, web and mobile experiences used by millions.",
  founded: "2014",
  industry: "Design",
  website: "pixelstudio.in",
  email: "hr@pixelstudio.in",
  address: "12 MP Nagar, Bhopal",
  phone: "+91 98765 43210",
};

// [title, location, salary, type]
const positions = [
  ["UI/UX Designer", "Bhopal", "₹6–9 LPA", "Full Time"],
  ["React Developer", "Indore", "₹8–14 LPA", "Full Time"],
  ["Digital Marketer", "Bhopal", "₹3–5 LPA", "Part Time"],
];

const footer = {
  "Quick Links": ["Jobs Listing", "About Us", "Contact Us", "Help / FAQ"],
  Account: ["Login", "Sign Up", "Profile", "Settings"],
  Resources: ["Support", "How It Works", "Privacy Policy", "Terms"],
};

// Section heading with small orange underline
function Heading({ children, className = "" }) {
  return (
    <div className={className}>
      <h3 className="text-2xl font-bold">{children}</h3>
      <div className="w-10 h-0.5 bg-[#FF8A00] mt-1" />
    </div>
  );
}

// Small label + value used in the About card
function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}

export default function CompanyDetails() {
  const [following, setFollowing] = useState(false);

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-32 h-24 bg-white">
        <Link to="/" className="text-3xl font-bold flex items-center">
          <span className="bg-[#FF8A00] rounded-lg w-12 h-12 mr-3" />CareerHub
        </Link>
        <ul className="hidden md:flex items-center gap-8 font-medium">
          {[["Home", "/"], ["Find Jobs", "/jobs"], ["Companies", "/companies"], ["Messages", "#"], ["Help", "#"], ["Contact", "#"]].map(([n, to]) => (
            <li key={n}>
              <Link
                to={to}
                className={`px-4 py-2 rounded ${n === "Companies" ? "bg-orange-100 text-[#FF8A00]" : "hover:text-[#FF8A00]"}`}
              >
                {n}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <Link to="/login" className={`${orange} px-8 py-3 rounded-full`}>Sign In</Link>
          <div className="relative w-14 h-14 rounded-full bg-slate-400 flex items-end justify-center overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-white absolute top-3" />
            <div className="w-10 h-5 rounded-t-full bg-white" />
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
        </div>
      </nav>

      {/* Page banner */}
      <section className="bg-slate-800 text-white text-center py-14 px-6">
        <h1 className="text-5xl font-bold">Company Details</h1>
        <p className="mt-6">
          <Link to="/" className="hover:text-[#FF8A00]">Home</Link> › Company Details
        </p>
      </section>

      <div className="px-6 md:px-32 py-12 space-y-6">
        {/* Company header */}
        <div className="bg-white border rounded-xl p-8 md:p-12 flex flex-col sm:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-emerald-500 text-white text-6xl font-bold flex items-center justify-center shrink-0">
            {company.name[0]}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-4xl font-bold">{company.name}</h2>
            <p className="text-gray-500 mt-3">
              {company.type} • {company.city} • {company.size}
            </p>
            <div className="flex gap-3 mt-5 justify-center sm:justify-start">
              <button
                onClick={() => setFollowing(!following)}
                className={`px-10 py-3 rounded-full font-semibold ${following ? "bg-gray-200 text-gray-600" : "bg-orange-100 text-[#FF8A00]"}`}
              >
                {following ? "Following" : "Follow"}
              </button>
              <a href="#positions" className={`${orange} px-8 py-3 rounded-full`}>View Jobs</a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_487px] gap-6 items-start">
          {/* Left column */}
          <div>
            {/* About */}
            <div className="bg-white border rounded-xl p-8">
              <Heading>About Company</Heading>
              <p className="text-gray-500 leading-8 mt-4 max-w-xl">{company.about}</p>
              <div className="grid grid-cols-2 gap-y-6 mt-12">
                <Info label="Founded" value={company.founded} />
                <Info label="Industry" value={company.industry} />
                <Info label="Website" value={company.website} />
                <Info label="Email" value={company.email} />
              </div>
            </div>

            {/* Open positions */}
            <div id="positions" className="mt-10">
              <Heading className="mb-6">Open Positions</Heading>
              <div className="space-y-4">
                {positions.map(([title, city, salary, type]) => (
                  <div key={title} className="bg-white border rounded-xl p-8 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 text-white text-3xl font-bold flex items-center justify-center shrink-0">
                      {company.name[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold">{title}</h4>
                      <p className="text-gray-500 mt-1">{company.name} • {city}</p>
                      <p className="font-semibold mt-1">{salary}</p>
                    </div>
                    <div className="flex sm:flex-col items-end gap-3">
                      <span className="bg-orange-100 text-[#FF8A00] text-sm font-semibold px-4 py-1 rounded-full">{type}</span>
                      <button className={`${orange} px-6 py-3 rounded-full`}>Apply Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <aside className="bg-white border rounded-xl p-8">
            <h3 className="text-2xl font-bold">Contact</h3>
            <ul className="mt-6 space-y-6 text-gray-600">
              <li>📍 {company.address}</li>
              <li>✉️ {company.email}</li>
              <li>📞 {company.phone}</li>
              <li>🌐 {company.website}</li>
            </ul>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-6 md:px-32 pt-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">
          <div>
            <div className="text-3xl font-bold flex items-center">
              <span className="bg-[#FF8A00] rounded-lg w-12 h-12 mr-3" />CareerHub
            </div>
            <p className="text-gray-300 mt-6 max-w-xs">Thousands of jobs from top companies, all in one place.</p>
          </div>
          {Object.entries(footer).map(([head, links]) => (
            <div key={head}>
              <h4 className="text-xl font-bold">{head}</h4>
              <div className="w-10 h-0.5 bg-[#FF8A00] mt-1 mb-5" />
              {links.map((l) => (
                <a key={l} href="#" className="block text-gray-300 mb-3 hover:text-[#FF8A00]">› {l}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-slate-700 py-6 text-center text-gray-400 text-sm">
          © 2026 CareerHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}