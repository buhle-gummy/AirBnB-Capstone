import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import AddListing from "./pages/AddListing";
import EditListing from "./pages/EditListing";
import Reservations from "./pages/Reservations";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/listings"
          element={<Listings />}
        />

        <Route
          path="/listings/add"
          element={<AddListing />}
        />

        <Route
          path="/listings/edit/:id"
          element={<EditListing />}
        />

        <Route
          path="/reservations"
          element={<Reservations />}
        />

        <Route
          path="/users"
          element={<Users />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;