// storage.js - one place for all localStorage logic in CareerHub.
// When you move to Spring Boot, only this file needs to change
// (each function becomes an API call from Api.js).

const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

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

/* ---------- Applications ---------- */

// Only the current user's applications
export function getApplications() {
  const user = getLoggedInUser();
  if (!user) return [];
  return read("applications", []).filter((a) => a.userEmail === user.email);
}

export function hasApplied(jobId) {
  return getApplications().some((a) => String(a.jobId) === String(jobId));
}

// job = { id, title, company, location }
export function addApplication(job, extra = {}) {
  const user = getLoggedInUser();
  if (!user) return { ok: false, reason: "not-logged-in" };
  if (hasApplied(job.id)) return { ok: false, reason: "already-applied" };

  const all = read("applications", []);
  all.push({
    id: Date.now(),
    jobId: job.id,
    title: job.title,
    company: job.company,
    location: job.location || "",
    appliedOn: new Date().toISOString(),
    status: "Applied",
    userEmail: user.email,
    ...extra, // e.g. { resumeName, coverLetter }
  });
  write("applications", all);
  return { ok: true };
}

export function removeApplication(id) {
  write(
    "applications",
    read("applications", []).filter((a) => a.id !== id)
  );
}

/* ---------- Saved jobs ---------- */

export function getSavedJobs() {
  const user = getLoggedInUser();
  if (!user) return [];
  return read("savedJobs", []).filter((j) => j.userEmail === user.email);
}

export function isJobSaved(jobId) {
  return getSavedJobs().some((j) => String(j.id) === String(jobId));
}

// Returns true if the job is saved after the call, false if it was removed
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
}