import { useCallback, useEffect, useState } from "react";
import "./Staffs.css";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3006/api").replace(/\/+$/, "");
const STAFF_URL = `${API_BASE}/admin/staff`;
const rolesList = [
  { role_id: 0, role_name: "All Roles" },
  { role_id: 2, role_name: "Chef" },
];

function getAdminToken() {
  return localStorage.getItem("adminToken") || localStorage.getItem("token");
}

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || result.error || "The staff request failed.");
  }
  return result;
}

export default function Staffs() {
  const [staffs, setStaffs] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: null,
    name: "",
    role_id: 2,
    status: "Active",
  });

  const loadStaff = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      setError("Sign in with an admin account to load staff from the database.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(STAFF_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await readResponse(response);
      setStaffs(Array.isArray(result) ? result : result.data || []);
    } catch (requestError) {
      setError(requestError.message || "Could not load staff from the database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const filteredStaffs = selectedRole === "All Roles"
    ? staffs
    : staffs.filter((staff) => staff.role_name === selectedRole);

  const handleOpenModal = (staff = null) => {
    setFormData(staff
      ? { ...staff, role_id: Number(staff.role_id) }
      : { user_id: null, name: "", role_id: 2, status: "Active" });
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (event) => {
    event.preventDefault();
    if (!formData.user_id) {
      setError("Adding staff needs a POST staff endpoint; this screen currently supports database loading, editing, and removal.");
      return;
    }

    const token = getAdminToken();
    if (!token) {
      setError("Sign in with an admin account before editing staff.");
      return;
    }

    try {
      const response = await fetch(`${STAFF_URL}/${formData.user_id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          role_id: Number(formData.role_id),
          status: formData.status,
        }),
      });
      await readResponse(response);
      setIsModalOpen(false);
      await loadStaff();
    } catch (requestError) {
      setError(requestError.message || "Could not update the staff member.");
    }
  };

  const handleRemoveStaff = async (id) => {
    const token = getAdminToken();
    if (!token) {
      setError("Sign in with an admin account before removing staff.");
      return;
    }

    try {
      const response = await fetch(`${STAFF_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await readResponse(response);
      await loadStaff();
    } catch (requestError) {
      setError(requestError.message || "Could not remove the staff member.");
    }
  };

  return (
    <div className="staffs-container">
      <div className="staffs-header">
        <div>
          <h1 className="staffs-title">Staff Management</h1>
          <p className="staffs-subtitle">Manage employee accounts and assigned roles</p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + Add Staff Member
        </button>
      </div>

      {error && <div className="staffs-error" role="alert">{error}</div>}

      <div className="role-filters">
        {rolesList.map((role) => (
          <button
            key={role.role_id}
            className={`role-tab ${selectedRole === role.role_name ? "active" : ""}`}
            onClick={() => setSelectedRole(role.role_name)}
          >
            {role.role_name}
          </button>
        ))}
      </div>

      <div className="table-card">
        <table className="staffs-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="staffs-empty">Loading staff…</td></tr>
            ) : filteredStaffs.length === 0 ? (
              <tr><td colSpan="5" className="staffs-empty">No staff records found.</td></tr>
            ) : filteredStaffs.map((staff) => (
              <tr key={staff.user_id}>
                <td className="user-id">#{staff.user_id}</td>
                <td className="staff-name">{staff.name}</td>
                <td><span className="role-badge">{staff.role_name}</span></td>
                <td>
                  <span className={`status-dot ${String(staff.status || "Active").toLowerCase().replace(/\s+/g, "-")}`}>
                    ● {staff.status || "Active"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleOpenModal(staff)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleRemoveStaff(staff.user_id)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>{formData.user_id ? "Edit Staff Member" : "Add New Staff Member"}</h2>
            <form onSubmit={handleSaveStaff}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  required
                />
              </div>
              <div className="form-group">
                <label>Assign Role</label>
                <select value={formData.role_id} onChange={(event) => setFormData({ ...formData, role_id: event.target.value })}>
                  {rolesList.filter((role) => role.role_name !== "All Roles").map((role) => (
                    <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                  <option value="Active">Active</option>
                  <option value="On Break">On Break</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
