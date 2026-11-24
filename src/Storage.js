

// // Backend URL. For hosting set VITE_API_URL (example: https://your-backend.com)
// const API_BASE =
//   ((import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:8081") + "/api";
import { API_BASE as BACKEND } from "./Config.js";
const API_BASE = BACKEND + "/api";

const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

/* ---------- Backend helper ---------- */

// Login saves the JWT in localStorage. We check the usual key names.
// If your Login.jsx uses another key, add its name to this list.
const TOKEN_KEYS = ["token", "jwt", "authToken", "accessToken"];

function getToken() {
  for (const key of TOKEN_KEYS) {
    let v = localStorage.getItem(key);
    if (!v) continue;
    if (v.startsWith('"')) {
      try {
        v = JSON.parse(v);
      } catch {
        /* use as is */
      }
    }
    if (v) return v;
  }
  const u = read("loggedInUser", null);
  return u?.token || u?.jwt || null;
}

async function api(path, { method = "GET", body } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty response */
  }

  if (!res.ok) {
    const err = new Error((data && data.message) || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}

/* ---------- Logged in user ---------- */

// Your loggedInUser has: fullName, gmail, phone, photo, skills, location, experience
// Older data may have: name / email / username. This normalizes all of them.
export function getLoggedInUser() {
  const raw = read("loggedInUser", null);
  if (!raw) return null;
  return {
    ...raw,
    name: raw.fullName || raw.name || raw.username || "User",
    email: raw.gmail || raw.email || "",
  };
}

export const isLoggedIn = () => getLoggedInUser() !== null;

/* ---------- Sync with the database ---------- */

// Loads this user's applications and saved jobs from the backend into the cache.
// Call it when the Dashboard opens (so the status set by the admin shows up). Returns true if it worked.
export async function syncFromServer() {
  const user = getLoggedInUser();
  if (!user || !getToken()) return false;

  try {
    const [apps, saved] = await Promise.all([api("/applications/me"), api("/saved-jobs")]);

    const otherApps = read("applications", []).filter((a) => a.userEmail !== user.email);
    write("applications", [
      ...otherApps,
      ...apps.map((a) => ({ ...a, userEmail: user.email })),
    ]);

    const otherSaved = read("savedJobs", []).filter((j) => j.userEmail !== user.email);
    write("savedJobs", [
      ...otherSaved,
      ...saved.map((j) => ({ ...j, userEmail: user.email })),
    ]);
    return true;
  } catch {
    return false;
  }
}

/* ---------- Applications ---------- */

// Only the current user's applications (from the cache)
export function getApplications() {
  const user = getLoggedInUser();
  if (!user) return [];
  return read("applications", []).filter((a) => a.userEmail === user.email);
}

// A cancelled application does not count, so the user can apply again
export function hasApplied(jobId) {
  return getApplications().some(
    (a) => String(a.jobId) === String(jobId) && a.status !== "Cancelled"
  );
}

// job = { id, title, company, location }   extra = the form answers from ApplyJob.jsx
// Returns { ok: true } or { ok: false, reason, message }
export async function addApplication(job, extra = {}) {
  const user = getLoggedInUser();
  if (!user) return { ok: false, reason: "not-logged-in" };
  if (hasApplied(job.id)) return { ok: false, reason: "already-applied" };

  try {
    const created = await api("/applications", {
      method: "POST",
      body: { jobId: job.id, ...extra },
    });

    const all = read("applications", []);
    all.push({ ...created, userEmail: user.email });
    write("applications", all);
    return { ok: true };
  } catch (err) {
    if (err.status === 401) return { ok: false, reason: "not-logged-in" };
    if (err.status === 409) return { ok: false, reason: "already-applied" };
    return { ok: false, reason: "error", message: err.message };
  }
}

// Cancel an application ("Withdraw"). The backend keeps it with status Cancelled,
// so the admin can see that the candidate cancelled. Returns true if it worked.
export async function removeApplication(id) {
  let gone = false;
  try {
    await api(`/applications/${id}`, { method: "DELETE" });
  } catch (err) {
    if (err.status === 404) gone = true; // already gone on the server
    else return false;
  }
  const all = read("applications", []);
  write(
    "applications",
    gone
      ? all.filter((a) => a.id !== id)
      : all.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
  );
  return true;
}

export const cancelApplication = removeApplication;

/* ---------- Saved jobs ---------- */

export function getSavedJobs() {
  const user = getLoggedInUser();
  if (!user) return [];
  return read("savedJobs", []).filter((j) => j.userEmail === user.email);
}

export function isJobSaved(jobId) {
  return getSavedJobs().some((j) => String(j.id) === String(jobId));
}

// Returns true if the job is saved after the call, false if it was removed.
// The cache changes immediately (so the heart icon reacts at once)
// and the database is updated in the background.
export function toggleSavedJob(job) {
  const user = getLoggedInUser();
  if (!user) return false;

  const all = read("savedJobs", []);
  const exists = all.some(
    (j) => String(j.id) === String(job.id) && j.userEmail === user.email
  );

  if (exists) {
    write(
      "savedJobs",
      all.filter((j) => !(String(j.id) === String(job.id) && j.userEmail === user.email))
    );
    api(`/saved-jobs/${job.id}`, { method: "DELETE" }).catch(() => {});
    return false;
  }

  all.push({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location || "",
    salary: job.salary || "",
    userEmail: user.email,
  });
  write("savedJobs", all);
  api(`/saved-jobs/${job.id}`, { method: "PUT" }).catch(() => {});
  return true;
}

export function removeSavedJob(id) {
  const user = getLoggedInUser();
  if (!user) return;
  write(
    "savedJobs",
    read("savedJobs", []).filter(
      (j) => !(String(j.id) === String(id) && j.userEmail === user.email)
    )
  );
  api(`/saved-jobs/${id}`, { method: "DELETE" }).catch(() => {});
}