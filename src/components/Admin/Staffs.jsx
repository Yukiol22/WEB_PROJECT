import { useCallback, useEffect, useState } from "react";
import "./Staffs.css";

const STAFF_URL = "http://localhost:3006/api/admin/staff";
const rolesList = [
  { role_id: 0, role_name: "All Roles" },
  { role_id: 3, role_name: "Chef" },
];

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.error || "The staff request failed.");
  return result;
}

export default function Staffs() {
  const [staffs, setStaffs] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ user_id: null, name: "", email: "", password: "", role_id: 3 });

  const loadStaff = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Sign in with an admin account to load staff from the database.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(STAFF_URL, { headers: { Authorization: `Bearer ${token}` } });
      const result = await readResponse(response);
      setStaffs(Array.isArray(result) ? result : result.data || []);
    } catch (requestError) {
      setError(requestError.message || "Could not load staff from the database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStaff(); }, [loadStaff]);

  const filteredStaffs = selectedRole === "All Roles"
    ? staffs
    : staffs.filter((staff) => staff.role_name === selectedRole);

  function openModal(staff = null) {
    setFormData(staff
      ? { ...staff, role_id: Number(staff.role_id), password: "" }
      : { user_id: null, name: "", email: "", password: "", role_id: 3 });
    setError("");
    setIsModalOpen(true);
  }

  async function saveStaff(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setError("Sign in with an admin account before editing staff.");

    setError("");
    try {
      const isNewStaff = !formData.user_id;
      const response = await fetch(isNewStaff ? STAFF_URL : `${STAFF_URL}/${formData.user_id}`, {
        method: isNewStaff ? "POST" : "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          ...(isNewStaff ? { email: formData.email, password: formData.password } : {}),
          role_id: Number(formData.role_id),
        }),
      });
      await readResponse(response);
      setIsModalOpen(false);
      await loadStaff();
    } catch (requestError) {
      setError(requestError.message || "Could not update the staff member.");
    }
  }

  async function removeStaff(id) {
    const token = localStorage.getItem("token");
    if (!token) return setError("Sign in with an admin account before removing staff.");
    try {
      await readResponse(await fetch(`${STAFF_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }));
      await loadStaff();
    } catch (requestError) {
      setError(requestError.message || "Could not remove the staff member.");
    }
  }

  return (
    <div className="staffs-container">
      <div className="staffs-header">
        <div>
          <h1 className="staffs-title">Staff Management</h1>
          <p className="staffs-subtitle">Manage employee accounts and assigned roles</p>
        </div>
        <button className="add-btn" onClick={() => openModal()}>+ Add Staff Member</button>
      </div>

      {error && <div className="staffs-error" role="alert">{error}</div>}

      <div className="role-filters">
        {rolesList.map((role) => (
          <button key={role.role_id} className={`role-tab ${selectedRole === role.role_name ? "active" : ""}`} onClick={() => setSelectedRole(role.role_name)}>
            {role.role_name}
          </button>
        ))}
      </div>

      <div className="table-card">
        <table className="staffs-table">
          <thead><tr><th>User ID</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="4" className="staffs-empty">Loading staff…</td></tr>
              : filteredStaffs.length === 0 ? <tr><td colSpan="4" className="staffs-empty">No staff records found.</td></tr>
                : filteredStaffs.map((staff) => (
                  <tr key={staff.user_id}>
                    <td className="user-id">#{staff.user_id}</td>
                    <td className="staff-name">{staff.name}</td>
                    <td><span className="role-badge">{staff.role_name}</span></td>
                    <td><div className="action-buttons">
                      <button className="edit-btn" onClick={() => openModal(staff)}>Edit</button>
                      <button className="delete-btn" onClick={() => removeStaff(staff.user_id)}>Remove</button>
                    </div></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <div className="modal-overlay"><div className="modal-card">
        <h2>{formData.user_id ? "Edit Staff Member" : "Add New Staff Member"}</h2>
        <form onSubmit={saveStaff}>
          <div className="form-group"><label>Full Name</label><input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="e.g. Alex Smith" required /></div>
          {!formData.user_id && <>
            <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required /></div>
            <div className="form-group"><label>Temporary Password (minimum 8 characters)</label><input type="password" minLength="8" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required /></div>
          </>}
          <div className="form-group"><label>Assign Role</label><select value={formData.role_id} onChange={(event) => setFormData({ ...formData, role_id: event.target.value })}>
            {rolesList.filter((role) => role.role_name !== "All Roles").map((role) => <option key={role.role_id} value={role.role_id}>{role.role_name}</option>)}
          </select></div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="save-btn">Save Changes</button>
          </div>
        </form>
      </div></div>}
    </div>
  );
}
