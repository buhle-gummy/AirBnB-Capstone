import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AirbnbMark from "../../components/AirbnbMark";

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error("USERS ERROR:", err);
      setError(err.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Change user role
  const handleRoleChange = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    const confirmed = window.confirm(
      `Change ${user.username}'s role to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user._id);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update user role"
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? { ...item, role: newRole }
            : item
        )
      );
    } catch (err) {
      console.error("ROLE UPDATE ERROR:", err);
      setError(err.message || "Failed to update user role");
    } finally {
      setActionLoading("");
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.username}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user._id);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete user"
        );
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => item._id !== user._id
        )
      );
    } catch (err) {
      console.error("DELETE USER ERROR:", err);
      setError(err.message || "Failed to delete user");
    } finally {
      setActionLoading("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const visibleUsers = users.filter((user) => `${user.username} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="users-page">

      {/* TOP NAVIGATION */}
      <nav className="top-nav">

        <div className="top-nav-logo">
          <span className="admin-brand-mark">
            <AirbnbMark />
          </span>
          Airbnb
        </div>

        <div className="top-nav-links">

          <button
            onClick={() => navigate("/dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => navigate("/listings")}
          >
            🏡 Listings
          </button>

          <button
            onClick={() => navigate("/reservations")}
          >
            📅 Reservations
          </button>

          <button className="active">
            👥 Users
          </button>

          <button
            className="logout-nav"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </nav>

      {/* USERS HEADER */}
      <div className="users-header">

        <div>
          <h1>Users</h1>

          <p>
            Manage registered users on your platform
          </p>
        </div>

        <div className="user-count">
          {users.length} Users
        </div>

        <input className="admin-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users by name, email or role" aria-label="Search users" />

      </div>

      {/* LOADING */}
      {loading && (
        <div className="listings-message">
          Loading users...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="listings-error">
          {error}
        </div>
      )}

      {/* EMPTY USERS */}
      {!loading &&
        !error &&
        users.length === 0 && (

          <div className="empty-listings">

            <h2>No users found</h2>

            <p>
              Registered users will appear here.
            </p>

          </div>
        )}

      {/* USERS TABLE */}
      {!loading &&
        users.length > 0 && (

          <div className="users-table-container">

            <table className="users-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {visibleUsers.map((user) => {

                  const isCurrentUser =
                    currentUser &&
                    (currentUser.id === user._id ||
                      currentUser._id === user._id);

                  return (
                    <tr key={user._id}>

                      <td>
                        <div className="user-info">

                          <div className="user-avatar">
                            {(user.username || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {user.username}
                          </strong>

                        </div>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        <span
                          className={`user-role ${user.role}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        {formatDate(user.createdAt)}
                      </td>

                      <td>

                        {isCurrentUser ? (

                          <span className="current-user-label">
                            Current user
                          </span>

                        ) : (

                          <div className="user-actions">

                            <button
                              className="role-button"
                              onClick={() =>
                                handleRoleChange(user)
                              }
                              disabled={
                                actionLoading === user._id
                              }
                            >
                              {actionLoading === user._id
                                ? "Updating..."
                                : user.role === "admin"
                                ? "Make User"
                                : "Make Admin"}
                            </button>

                            <button
                              className="delete-user-button"
                              onClick={() =>
                                handleDelete(user)
                              }
                              disabled={
                                actionLoading === user._id
                              }
                            >
                              {actionLoading === user._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

    </div>
  );
}

export default Users;
