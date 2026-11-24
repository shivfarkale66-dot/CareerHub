// Put this file in: src/api.js   (replaces the earlier api.js)
// const BASE = import.meta.env.VITE_API_URL || "http://localhost:8081";
import { API_BASE as BASE } from "./Config.js";

// fetch with the login token. Use this for every protected endpoint.
export async function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error("Session expired or no access. Please login again.");
  }
  return res;
}

// The logged in user's applications.
// Each item: { id, jobId, title, company, location, appliedOn, status, note }
// status: Applied, In review, Shortlisted, Confirmed, Rejected, Cancelled
export async function getMyApplications() {
  const res = await authFetch("/api/applications/me");
  if (!res.ok) return [];
  return res.json();
}

// "Withdraw" now marks the application as Cancelled (the admin can still see it)
export async function withdrawApplication(id) {
  const res = await authFetch(`/api/applications/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.message || "Could not cancel the application.");
  }
}