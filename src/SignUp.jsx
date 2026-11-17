import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

// Backend signup endpoint (change the port if your backend runs elsewhere)
const API_URL = "http://localhost:8081/api/auth/signup";

// Shared style for orange buttons
const orange = "bg-[#FF8A00] text-white font-semibold";

// Form fields are rendered from this list
const fields = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
  { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
  { name: "password", label: "Password", type: "password", placeholder: "Create a password" },
  { name: "confirm", label: "Confirm Password", type: "password", placeholder: "Re-enter password" },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update the field and clear any old error
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Keys must match the fields in SignupRequest.java
        body: JSON.stringify({
          fullName: form.fullName,
          gmail: form.email,
          password: form.password,
          confirmPassword: form.confirm,
        }),
      });

      // Backend can reply with JSON or plain text
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        setError(data.message || data.error || "Signup failed. Please try again.");
        return;
      }

      // Go to the Login page after signup
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      console.error("Signup error:", err);
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-800 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Sign up form */}
      <main className="flex-1 bg-[#F8F8F8] py-14 px-4">
        <div className="max-w-[560px] mx-auto">
          <form onSubmit={handleSubmit} className="bg-white border border-[#EEE] rounded-xl p-10">
            {/* Login / Sign Up switch */}
            <div className="grid grid-cols-2 bg-[#F3F4F6] rounded-lg p-1 mb-8">
              <Link to="/login" className="text-center py-3 rounded-md font-semibold text-gray-500 hover:text-[#FF8A00]">
                Login
              </Link>
              <Link to="/signup" className="text-center py-3 rounded-md font-semibold bg-white text-[#FF8A00] shadow-sm">
                Sign Up
              </Link>
            </div>

            <h2 className="text-4xl font-bold text-center">Sign Up</h2>
            <span className="block w-16 h-[3px] bg-[#FF8A00] mx-auto mt-2 mb-4" />
            <p className="text-center text-gray-500 mb-8">Create a new account. It only takes a minute.</p>

            {fields.map((f, i) => (
              <div key={f.name} className={i > 0 ? "mt-6" : ""}>
                <label htmlFor={f.name} className="block font-semibold text-sm mb-2">
                  {f.label}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  required
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="w-full h-14 px-5 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#FF8A00]"
                />
              </div>
            ))}

            {/* Error message */}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`${orange} w-full h-14 rounded-lg mt-8 text-lg disabled:opacity-60`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center font-semibold mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FF8A00]">Login</Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}