import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:8081/api/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = email, 2 = code + new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function post(path, payload) {
    console.log("POST", path, payload); // debugging ke liye, baad mein hata dena
    const res = await fetch(`${API}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      /* empty body */
    }
    if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
    return data;
  }

  async function handleSendCode(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      // dono keys bhej rahe hain taaki backend koi bhi padhe, chalega
      const data = await post("forgot-password", {
        email: cleanEmail,
        gmail: cleanEmail,
      });
      setInfo(data.message || "Code sent");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!code.trim() || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await post("reset-password", {
        email: email.trim(),
        gmail: email.trim(),
        code: code.trim(),
        password,
        newPassword: password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-orange-400";
  const buttonClass =
    "w-full rounded-lg bg-orange-500 py-3 text-lg font-semibold text-white hover:bg-orange-600 disabled:opacity-60";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          Forgot Password
        </h1>
        <div className="mx-auto mt-2 h-1 w-20 bg-orange-500" />

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="mt-6 space-y-4">
            <p className="text-center text-gray-500">
              Enter your email and we will send you a reset code.
            </p>

            <label className="block font-semibold text-slate-800">
              Email Address
            </label>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" className={buttonClass} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            {info && <p className="text-center text-green-600">{info}</p>}

            <label className="block font-semibold text-slate-800">
              6-digit Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className={inputClass}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
            />

            <label className="block font-semibold text-slate-800">
              New Password
            </label>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" className={buttonClass} disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>

            <button
              type="button"
              className="w-full text-sm text-gray-500 underline"
              onClick={() => {
                setStep(1);
                setCode("");
                setPassword("");
                setError("");
                setInfo("");
              }}
            >
              Use a different email
            </button>
          </form>
        )}

        <p className="mt-6 text-center font-medium text-slate-800">
          Remember your password?{" "}
          <Link to="/login" className="font-semibold text-orange-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}