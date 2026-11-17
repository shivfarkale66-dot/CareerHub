import { Navigate, useLocation } from "react-router-dom";

// Lets the page open only if a user is logged in (user + token).
// Pass role="ADMIN" or role="USER" to also check the role.
export default function ProtectedRoute({ role, children }) {
  const location = useLocation();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("loggedInUser"));
  } catch {
    user = null;
  }
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />;
  }

  return children;
}