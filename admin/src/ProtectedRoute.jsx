import { Navigate, useLocation } from "react-router-dom";
import { clearSession, getStoredUser, getToken } from "./auth";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getToken();
  const user = getStoredUser();

  if (!token || !user) {
    clearSession();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "Admin access is required for this dashboard." }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
