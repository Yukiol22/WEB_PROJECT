import { useState, useEffect, useCallback } from "react";
import "./Menu_Edit.css";

const API = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const EMPTY_FORM = { item_id: null, name: "", price: "", category_id: "" };

export default function Menu_Edit() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const loadData = useCallback(async () => {
    try {
      setError("");
      const [menuRes, catRes] = await Promise.all([
        fetch(`${API}/menu`),
        fetch(`${API}/categories`),
      ]);
      if (!menuRes.ok || !catRes.ok) throw new Error("Failed to load menu data");

      setItems(await menuRes.json());
      setCategories(await catRes.json());
    } catch (err) {
      setError(err.message || "Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const tabs = ["All", ...categories.map((c) => c.name)];

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category_name === activeCategory);

  // ---------- Modal ----------
  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        item_id: item.item_id,
        name: item.name,
        price: item.price,
        category_id: item.category_id,
      });
    } else {
      setFormData({
        ...EMPTY_FORM,
        category_id: categories[0]?.category_id ?? "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_FORM);
  };

  // ---------- Create / Update ----------
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price === "") return;

    const payload = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category_id: Number(formData.category_id),
    };

    try {
      setSaving(true);
      setError("");

      const isEdit = Boolean(formData.item_id);
      const res = await fetch(
        isEdit
          ? `${API}/admin/menu/${formData.item_id}`
          : `${API}/admin/menu`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error("Failed to save the item");

      handleCloseModal();
      await loadData(); // refresh from the database
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    try {
      setError("");
      const res = await fetch(`${API}/admin/menu/${item.item_id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {

        throw new Error(
          "Could not delete this item. It may be part of existing orders.",
        );
      }
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="menu-edit-container">
      {/* Header */}
      <div className="menu-header">
        <div>
          <h1 className="menu-title">Menu Management</h1>
          <p className="menu-subtitle">
            Add, edit, or remove items from your menu catalog
          </p>
        </div>
        <button
          className="add-btn"
          onClick={() => handleOpenModal()}
          disabled={loading || categories.length === 0}
        >
          + Add New Item
        </button>
      </div>

      {error && (
        <div className="menu-error">
          {error}
          <button className="menu-error-close" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}


      <div className="category-tabs">
        {tabs.map((name) => (
          <button
            key={name}
            className={`tab-btn ${activeCategory === name ? "active" : ""}`}
            onClick={() => setActiveCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>


      {loading ? (
        <p className="menu-status">Loading menu...</p>
      ) : filteredItems.length === 0 ? (
        <p className="menu-status">No items in this category yet.</p>
      ) : (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item.item_id} className="menu-card">
              <div className="card-header">
                <span className="category-badge">{item.category_name}</span>
                <span className="item-price">
                  ${Number(item.price).toFixed(2)}
                </span>
              </div>
              <h3 className="item-name">{item.name}</h3>

              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleOpenModal(item)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteItem(item)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{formData.item_id ? "Edit Menu Item" : "Add New Menu Item"}</h2>
            <form onSubmit={handleSaveItem}>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Garlic Bread"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="e.g. 5.99"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
