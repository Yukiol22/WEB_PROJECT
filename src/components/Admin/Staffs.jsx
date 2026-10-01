import { useState } from "react";
import "./Staffs.css";

const rolesList = [
  { role_id: 1, role_name: "All Roles" },
  { role_id: 2, role_name: "Manager" },
  { role_id: 3, role_name: "Chef" },
  { role_id: 4, role_name: "Waiter" },
  { role_id: 5, role_name: "Cashier" },
];

const initialStaffs = [
  {
    user_id: 101,
    name: "Alex Mercer",
    role_id: 2,
    role_name: "Manager",
    status: "Active",
  },
  {
    user_id: 102,
    name: "Sarah Jenkins",
    role_id: 3,
    role_name: "Chef",
    status: "Active",
  },
  {
    user_id: 103,
    name: "David Chen",
    role_id: 4,
    role_name: "Waiter",
    status: "On Break",
  },
  {
    user_id: 104,
    name: "Maria Garcia",
    role_id: 5,
    role_name: "Cashier",
    status: "Active",
  },
];

export default function Staffs() {
  const [staffs, setStaffs] = useState(initialStaffs);
  const [selectedRole, setSelectedRole] = useState("All Roles");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: null,
    name: "",
    role_id: 2,
    status: "Active",
  });

  const filteredStaffs =
    selectedRole === "All Roles"
      ? staffs
      : staffs.filter((s) => s.role_name === selectedRole);

  const handleOpenModal = (staff = null) => {
    if (staff) {
      // Edit existing staff member
      setFormData(staff);
    } else {
      // Add new staff member
      setFormData({
        user_id: null,
        name: "",
        role_id: 2,
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const roleObj = rolesList.find(
      (r) => r.role_id === Number(formData.role_id),
    );

    if (formData.user_id) {
      // Update existing record
      setStaffs(
        staffs.map((s) =>
          s.user_id === formData.user_id
            ? { ...formData, role_name: roleObj.role_name }
            : s,
        ),
      );
    } else {
      // Create new record
      const newMember = {
        ...formData,
        user_id: Date.now(),
        role_name: roleObj.role_name,
      };
      setStaffs([...staffs, newMember]);
    }

    setIsModalOpen(false);
  };

  const handleRemoveStaff = (id) => {
    setStaffs(staffs.filter((s) => s.user_id !== id));
  };

  return (
    <div className="staffs-container">
      {/* Header */}
      <div className="staffs-header">
        <div>
          <h1 className="staffs-title">Staff Management</h1>
          <p className="staffs-subtitle">
            Manage employee accounts and assigned roles
          </p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + Add Staff Member
        </button>
      </div>

      {/* Role Filters */}
      <div className="role-filters">
        {rolesList.map((r) => (
          <button
            key={r.role_id}
            className={`role-tab ${selectedRole === r.role_name ? "active" : ""}`}
            onClick={() => setSelectedRole(r.role_name)}
          >
            {r.role_name}
          </button>
        ))}
      </div>

      {/* Staff Table */}
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
            {filteredStaffs.map((staff) => (
              <tr key={staff.user_id}>
                <td className="user-id">#{staff.user_id}</td>
                <td className="staff-name">{staff.name}</td>
                <td>
                  <span className="role-badge">{staff.role_name}</span>
                </td>
                <td>
                  <span
                    className={`status-dot ${staff.status.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    ● {staff.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenModal(staff)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleRemoveStaff(staff.user_id)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>
              {formData.user_id ? "Edit Staff Member" : "Add New Staff Member"}
            </h2>
            <form onSubmit={handleSaveStaff}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Assign Role</label>
                <select
                  value={formData.role_id}
                  onChange={(e) =>
                    setFormData({ ...formData, role_id: e.target.value })
                  }
                >
                  {rolesList
                    .filter((r) => r.role_name !== "All Roles")
                    .map((r) => (
                      <option key={r.role_id} value={r.role_id}>
                        {r.role_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="On Break">On Break</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
