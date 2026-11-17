// Put this file in: src/App.jsx   (replaces your file)
// Changes compared to your App.jsx:
//   1) /interview/:id and /interview/:id/call now open the new in-app call page (InterviewCall),
//      for BOTH the user and the admin (it used to be user only, so the admin could never join)
//   2) new admin routes: /admin/live (live interviews with Join button) and /admin/applications
import { Routes, Route, Navigate } from "react-router-dom";

// Authentication & Protected Routes
import ProtectedRoute from "./ProtectedRoute.jsx";

// Public Pages
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import JobListing from "./JobListing.jsx";
// import JobSearch from "./JobSearch.jsx";
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
// import InterviewRoom from "./InterviewRoom.jsx";   // replaced by InterviewCall (you can delete InterviewRoom.jsx later)

// Interview call page (used by the user AND the admin)
import InterviewCall from "./InterviewCall.jsx";

// Admin Pages
import AdminDashboard from "./AdminDashboard.jsx";
import AdminJobs from "./admin/AdminJobs.jsx";
import AdminApplications from "./admin/AdminApplications.jsx";
import LiveInterviews from "./admin/LiveInterviews.jsx";

export default function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<SignUp />} />

      <Route path="/jobs" element={<JobListing />} />

      {/* <Route path="/search" element={<JobSearch />} /> */}

      <Route path="/companies" element={<Companies />} />

      <Route
        path="/companies/:id"
        element={<CompanyDetails />}
      />

      <Route path="/help" element={<HelpFAQ />} />

      <Route path="/about" element={<AboutUs />} />

      <Route path="/contact" element={<ContactUs />} />


      {/* ================= USER PROTECTED ROUTES ================= */}

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


      {/* ================= INTERVIEW CALL (user and admin) =================
          No role here on purpose: both the candidate and the recruiter (admin) must be able to open it.
          The backend (CallController) checks that the person really belongs to this interview. */}

      <Route path="/interview/:id" element={<InterviewCall />} />

      <Route path="/interview/:id/call" element={<InterviewCall />} />


      {/* ================= ADMIN PROTECTED ROUTES ================= */}

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


      {/* ================= UNKNOWN ROUTES ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}





// // Put this file in: src/App.jsx   (replaces your file)
// // Changes compared to your App.jsx:
// //   1) ProtectedRoute now comes from RequireRole.jsx. It sends the person to /login when there is no token
// //      or the token has expired (before, an old login still opened the admin page with an empty list),
// //      and sends the wrong role (a USER on an admin page) to the home page.
// //   2) /interview/:id and /interview/:id/call open the in-app call page (InterviewCall) for BOTH the
// //      user and the admin. They need a login, but no fixed role.
// //   3) admin routes: /admin/live and /admin/applications
// // Needs these files in src/:  RequireRole.jsx and the newer api.js (from the careerhub-fix4 folder)
// import { Routes, Route, Navigate } from "react-router-dom";

// // Authentication & Protected Routes
// import ProtectedRoute from "./RequireRole.jsx";   // was ./ProtectedRoute.jsx

// // Public Pages
// import Home from "./Home.jsx";
// import Login from "./Login.jsx";
// import SignUp from "./SignUp.jsx";
// import JobListing from "./JobListing.jsx";
// // import JobSearch from "./JobSearch.jsx";
// import Companies from "./Companies.jsx";
// import CompanyDetails from "./CompanyDetails.jsx";
// import HelpFAQ from "./HelpFAQ.jsx";
// import AboutUs from "./AboutUs.jsx";
// import ContactUs from "./ContactUs.jsx";

// // User Pages
// import ApplyJob from "./ApplyJob.jsx";
// import Dashboard from "./Dashboard.jsx";
// import Messages from "./Messages.jsx";
// import Notifications from "./Notifications.jsx";
// import Profile from "./Profile.jsx";
// import Settings from "./Settings.jsx";
// import MyInterviews from "./MyInterviews.jsx";
// // import InterviewRoom from "./InterviewRoom.jsx";   // replaced by InterviewCall (you can delete InterviewRoom.jsx later)

// // Interview call page (used by the user AND the admin)
// import InterviewCall from "./InterviewCall.jsx";

// // Admin Pages
// import AdminDashboard from "./AdminDashboard.jsx";
// import AdminJobs from "./admin/AdminJobs.jsx";
// import AdminApplications from "./admin/AdminApplications.jsx";
// import LiveInterviews from "./admin/LiveInterviews.jsx";

// export default function App() {
//   return (
//     <Routes>

//       {/* ================= PUBLIC ROUTES ================= */}

//       <Route path="/" element={<Home />} />

//       <Route path="/login" element={<Login />} />

//       <Route path="/signup" element={<SignUp />} />

//       <Route path="/jobs" element={<JobListing />} />

//       {/* <Route path="/search" element={<JobSearch />} /> */}

//       <Route path="/companies" element={<Companies />} />

//       <Route
//         path="/companies/:id"
//         element={<CompanyDetails />}
//       />

//       <Route path="/help" element={<HelpFAQ />} />

//       <Route path="/about" element={<AboutUs />} />

//       <Route path="/contact" element={<ContactUs />} />


//       {/* ================= USER PROTECTED ROUTES ================= */}

//       <Route
//         path="/apply/:id"
//         element={
//           <ProtectedRoute role="USER">
//             <ApplyJob />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute role="USER">
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/messages"
//         element={
//           <ProtectedRoute role="USER">
//             <Messages />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/notifications"
//         element={
//           <ProtectedRoute role="USER">
//             <Notifications />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute role="USER">
//             <Profile />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/settings"
//         element={
//           <ProtectedRoute role="USER">
//             <Settings />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/my-interviews"
//         element={
//           <ProtectedRoute role="USER">
//             <MyInterviews />
//           </ProtectedRoute>
//         }
//       />


//       {/* ================= INTERVIEW CALL (user and admin) =================
//           No role on purpose: both the candidate and the recruiter (admin) must be able to open it.
//           Without a login the person is sent to /login and comes back here afterwards.
//           The backend (CallController) checks that the person really belongs to this interview. */}

//       <Route
//         path="/interview/:id"
//         element={
//           <ProtectedRoute>
//             <InterviewCall />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/interview/:id/call"
//         element={
//           <ProtectedRoute>
//             <InterviewCall />
//           </ProtectedRoute>
//         }
//       />


//       {/* ================= ADMIN PROTECTED ROUTES ================= */}

//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute role="ADMIN">
//             <AdminDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/jobs"
//         element={
//           <ProtectedRoute role="ADMIN">
//             <AdminJobs />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/applications"
//         element={
//           <ProtectedRoute role="ADMIN">
//             <AdminApplications />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/live"
//         element={
//           <ProtectedRoute role="ADMIN">
//             <LiveInterviews />
//           </ProtectedRoute>
//         }
//       />


//       {/* ================= UNKNOWN ROUTES ================= */}

//       <Route
//         path="*"
//         element={<Navigate to="/" replace />}
//       />

//     </Routes>
//   );
// }