
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Listings from "./pages/Listings";
import StayDetails from "./pages/StayDetails";
import CreateReservation from "./pages/CreateReservation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Listings */}
        <Route path="/listings" element={<Listings />} />

        {/* Property details */}
        <Route path="/stay/:id" element={<StayDetails />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected booking page */}
        <Route
          path="/reserve/:id"
          element={
            <ProtectedRoute>
              <CreateReservation />
            </ProtectedRoute>
          }
        />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;