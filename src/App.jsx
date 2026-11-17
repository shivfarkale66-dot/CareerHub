
import { Routes, Route, Navigate } from "react-router-dom";

// Authentication & Protected Routes
// import ProtectedRoute from "./ProtectedRoute.jsx";

import ProtectedRoute from "./Protectedroute.jsx";

// Public Pages
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import JobListing from "./JobListing.jsx";
import Companies from "./Companies.jsx";
import CompanyDetails from "./CompanyDetails.jsx";
import HelpFAQ from "./HelpFAQ.jsx";
import AboutUs from "./AboutUs.jsx";
import ContactUs from "./ContactUs.jsx";

// User Pages
import ApplyJob from "./ApplyJob.jsx";
import Dashboard from "./Dashboard.jsx";
import Messages from "./Messages.jsx";
import Notifications from "./Notifications.jsx";
import Profile from "./Profile.jsx";
import Settings from "./Settings.jsx";
import MyInterviews from "./MyInterviews.jsx";

// Interview Call
import InterviewCall from "./InterviewCall.jsx";

// Admin Pages
import AdminDashboard from "./AdminDashboard.jsx";
import AdminJobs from "./admin/AdminJobs.jsx";
import AdminApplications from "./admin/AdminApplications.jsx";
import LiveInterviews from "./LiveInterviews.jsx";

export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<SignUp />} />

      <Route path="/jobs" element={<JobListing />} />

      <Route path="/companies" element={<Companies />} />

      <Route
        path="/companies/:id"
        element={<CompanyDetails />}
      />

      <Route path="/help" element={<HelpFAQ />} />

      <Route path="/about" element={<AboutUs />} />

      <Route path="/contact" element={<ContactUs />} />


      {/* USER PROTECTED ROUTES */}

      <Route
        path="/apply/:id"
        element={
          <ProtectedRoute role="USER">
            <ApplyJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="USER">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute role="USER">
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute role="USER">
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute role="USER">
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute role="USER">
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-interviews"
        element={
          <ProtectedRoute role="USER">
            <MyInterviews />
          </ProtectedRoute>
        }
      />


      {/* INTERVIEW CALL - USER AND ADMIN */}

      <Route
        path="/interview/:id"
        element={
          <ProtectedRoute>
            <InterviewCall />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview/:id/call"
        element={
          <ProtectedRoute>
            <InterviewCall />
          </ProtectedRoute>
        }
      />


      {/* ADMIN PROTECTED ROUTES */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/live"
        element={
          <ProtectedRoute role="ADMIN">
            <LiveInterviews />
          </ProtectedRoute>
        }
      />


      {/* UNKNOWN ROUTES */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}
