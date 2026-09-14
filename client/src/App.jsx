import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerHome from "./pages/CustomerHome";
import StayDetails from "./pages/StayDetails";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import AddListing from "./pages/AddListing";
import EditListing from "./pages/EditListing";
import Reservations from "./pages/Reservations";
import CreateReservation from "./pages/CreateReservation";
import Users from "./pages/Users";
import Register from "./pages/Register";
import LocationResults from "./pages/LocationResults";
import ProtectedRoute from "./ProtectedRoute";

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("airbnb-theme") || "light";
    document.documentElement.dataset.theme = savedTheme;
  }, []);

  const AuthRoute = ({ children }) =>
    localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/stays/:id" element={<StayDetails />} />
        <Route path="/locations" element={<LocationResults />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/listings"
          element={
            <Protected>
              <Listings />
            </Protected>
          }
        />
        <Route
          path="/listings/new"
          element={
            <Protected>
              <AddListing />
            </Protected>
          }
        />
        <Route
          path="/listings/edit/:id"
          element={
            <Protected>
              <EditListing />
            </Protected>
          }
        />
        <Route
          path="/reservations/new/:id"
          element={
            <AuthRoute>
              <CreateReservation />
            </AuthRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <AuthRoute>
              <Reservations />
            </AuthRoute>
          }
        />
        <Route
          path="/users"
          element={
            <Protected>
              <Users />
            </Protected>
          }
        />
        <Route path="*" element={<CustomerHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
