
import { useEffect, useMemo, useState } from "react";
import { authJson } from "../authFetch.js";
import { fmtDate, fmtTime, getState, getTimes } from "../interviewUtils.js";

import ScheduleInterviewModal from "./ScheduleInterviewModal.jsx";
import RescheduleModal from "./RescheduleModal.jsx";
import CancelModal from "./CancelModal.jsx";
import ResultModal from "./ResultModal.jsx";
import CallButton from "../CallButton.jsx";

// Interview Status
const stateInfo = {
  UPCOMING: {
    label: "Scheduled",
    style: "bg-gray-100 text-gray-700 border-gray-200",
  },
  JOIN_SOON: {
    label: "Starting soon",
    style: "bg-gray-100 text-gray-700 border-gray-200",
  },
  LIVE: {
    label: "In progress",
    style: "bg-gray-100 text-gray-700 border-gray-200",
  },
  MISSED: {
    label: "Awaiting result",
    style: "bg-gray-100 text-gray-700 border-gray-200",
  },
  COMPLETED: {
    label: "Completed",
    style: "bg-gray-100 text-gray-700 border-gray-200",
  },
  CANCELLED: {
    label: "Cancelled",
    style: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

// Result Status
const resultInfo = {
  SELECTED: {
    label: "Selected",
    style: "bg-gray-100 text-gray-700 border-gray-200",
  },
  REJECTED: {
    label: "Rejected",
    style: "bg-gray-100 text-gray-700 border-gray-200",
  },
  ON_HOLD: {
    label: "On hold",
    style: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

// Interview Type
const typeStyle = {
  VIDEO: "bg-gray-100 text-gray-700 border-gray-200",
  AUDIO: "bg-gray-100 text-gray-700 border-gray-200",
};

// Filters
const FILTERS = [
  "All",
  "Upcoming",
  "Awaiting result",
  "Completed",
  "Cancelled",
];

// Filter Logic
const matchesFilter = (state, filter) => {
  if (filter === "All") return true;

  if (filter === "Upcoming") {
    return ["UPCOMING", "JOIN_SOON", "LIVE"].includes(state);
  }

  if (filter === "Awaiting result") return state === "MISSED";
  if (filter === "Completed") return state === "COMPLETED";

  return state === "CANCELLED";
};

// Badge Component
function Badge({ className, children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        className || "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      {children}
    </span>
  );
}

// Statistics Card
function StatCard({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {value ?? 0}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function InterviewManagement() {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [stats, setStats] = useState({
    candidates: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [now, setNow] = useState(new Date());

  // Load Interview Data
  const load = async () => {
    try {
      const [s, u, i] = await Promise.all([
        authJson("/api/admin/stats"),
        authJson("/api/admin/users"),
        authJson("/api/admin/interviews"),
      ]);

      setStats(s);
      setCandidates(Array.isArray(u) ? u : []);
      setInterviews(Array.isArray(i) ? i : []);
      setError("");
    } catch (e) {
      setError(e.message || "Could not load interviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Update Interview Status
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Hide Toast
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast]);

  // After Successful Modal Action
  const saved = (message) => {
    setModal(null);
    setToast(message);
    load();
  };

  // Search and Filter
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return interviews
      .map((iv) => ({
        ...iv,
        state: getState(iv, now),
      }))
      .filter((iv) => matchesFilter(iv.state, filter))
      .filter(
        (iv) =>
          !q ||
          (iv.userName || "").toLowerCase().includes(q) ||
          (iv.userGmail || "").toLowerCase().includes(q) ||
          (iv.jobTitle || "").toLowerCase().includes(q) ||
          (iv.companyName || "").toLowerCase().includes(q)
      );
  }, [interviews, now, filter, query]);

  return (
    <section className="min-h-screen w-full bg-gray-50 p-4 text-gray-800 sm:p-6 lg:p-8">

      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-500">
            ADMIN PANEL / INTERVIEWS
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Interview Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage candidates, schedule interviews and track interview results.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ type: "schedule" })}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          <span className="text-lg">+</span>
          Schedule Interview
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Candidates"
          value={stats.candidates}
          icon="👥"
          color="bg-gray-100"
        />

        <StatCard
          title="Scheduled Interviews"
          value={stats.scheduled}
          icon="📅"
          color="bg-gray-100"
        />

        <StatCard
          title="Completed Interviews"
          value={stats.completed}
          icon="✓"
          color="bg-gray-100"
        />

        <StatCard
          title="Cancelled Interviews"
          value={stats.cancelled}
          icon="✕"
          color="bg-gray-100"
        />
      </div>

      {/* Interview Management Panel */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Panel Header */}
        <div className="border-b border-gray-200 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                All Interviews
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage all candidate interviews.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search candidate, job or company..."
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                  filter === f
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="mx-5 mt-5 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700">
            ✓ {toast}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="p-12 text-center">
            <p className="font-medium text-gray-600">
              Loading interviews...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}

            <button
              type="button"
              onClick={load}
              className="ml-3 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && rows.length === 0 && (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              📅
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              No interviews found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {interviews.length === 0
                ? "Schedule your first interview to get started."
                : "Try changing your search or selected filter."}
            </p>
          </div>
        )}

        {/* Interview Cards */}
        {!loading && !error && rows.length > 0 && (
          <div className="divide-y divide-gray-100">
            {rows.map((iv) => {
              const { start } = getTimes(iv);

              const info = stateInfo[iv.state] || stateInfo.UPCOMING;

              const canChange = [
                "UPCOMING",
                "JOIN_SOON",
              ].includes(iv.state);

              const canResult = [
                "LIVE",
                "MISSED",
                "COMPLETED",
              ].includes(iv.state);

              const canCall = [
                "JOIN_SOON",
                "LIVE",
                "MISSED",
              ].includes(iv.state);

              const res = resultInfo[iv.result];

              return (
                <div key={iv.id} className="p-5 sm:p-6">

                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                    {/* Candidate Details */}
                    <div className="flex min-w-0 items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-700">
                        {(iv.userName || "U").charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate font-bold text-gray-900">
                          {iv.userName || "Candidate"}
                        </h3>

                        <p className="mt-1 truncate text-sm text-gray-500">
                          {iv.userGmail}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-gray-800">
                          {iv.jobTitle || "Position not specified"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {iv.companyName || "Company not specified"}
                        </p>

                        {/* Interview Details */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>📅 {fmtDate(start)}</span>
                          <span>•</span>
                          <span>🕒 {fmtTime(start)}</span>
                          <span>•</span>
                          <span>
                            {iv.durationMinutes || 30} minutes
                          </span>
                        </div>

                        {/* Badges */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge className={typeStyle[iv.mode]}>
                            {iv.mode === "VIDEO"
                              ? "Video Interview"
                              : "Audio Interview"}
                          </Badge>

                          <Badge className={info.style}>
                            {info.label}
                          </Badge>

                          {res && (
                            <Badge className={res.style}>
                              {res.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 xl:justify-end">

                      {canCall && (
                        <CallButton
                          interview={iv}
                          now={now}
                          size="sm"
                        />
                      )}

                      {canChange && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setModal({
                                type: "reschedule",
                                interview: iv,
                              })
                            }
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                          >
                            Reschedule
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setModal({
                                type: "cancel",
                                interview: iv,
                              })
                            }
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {canResult && (
                        <button
                          type="button"
                          onClick={() =>
                            setModal({
                              type: "result",
                              interview: iv,
                            })
                          }
                          className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
                        >
                          {iv.result && iv.result !== "PENDING"
                            ? "Edit Result"
                            : "Update Result"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Feedback */}
                  {iv.feedback && (
                    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                        Interview Feedback
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {iv.feedback}
                      </p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* Footer Count */}
        {!loading && !error && rows.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-xs font-medium text-gray-500">
              Showing {rows.length} of {interviews.length} interviews
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === "schedule" && (
        <ScheduleInterviewModal
          candidates={candidates}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}

      {modal?.type === "reschedule" && (
        <RescheduleModal
          interview={modal.interview}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}

      {modal?.type === "cancel" && (
        <CancelModal
          interview={modal.interview}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}

      {modal?.type === "result" && (
        <ResultModal
          interview={modal.interview}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}

    </section>
  );
}
