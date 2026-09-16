import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import AddListing from "./pages/AddListing";
import EditListing from "./pages/EditListing";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";
import ProtectedRoute from "./ProtectedRoute";

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/listings" element={<Protected><Listings /></Protected>} />
        <Route path="/listings/new" element={<Protected><AddListing /></Protected>} />
        <Route path="/listings/edit/:id" element={<Protected><EditListing /></Protected>} />
        <Route path="/reservations" element={<Protected><Reservations /></Protected>} />
        <Route path="/users" element={<Protected><Users /></Protected>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
