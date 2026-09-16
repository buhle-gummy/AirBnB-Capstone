import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import CustomerHome from "./pages/CustomerHome";
import StayDetails from "./pages/StayDetails";
import LocationResults from "./pages/LocationResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateReservation from "./pages/CreateReservation";

function AuthRoute({ children }) {
  const location = useLocation();
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" replace state={{ from: location.pathname, booking: location.state }} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/stays/:id" element={<StayDetails />} />
        <Route path="/locations" element={<LocationResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reservations/new/:id" element={<AuthRoute><CreateReservation /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
