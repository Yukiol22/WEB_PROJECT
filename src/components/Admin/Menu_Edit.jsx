import { useEffect, useState } from "react";
import "./Menu_Edit.css";

const API_URL = "http://localhost:3006/api";

const categories = ["All", "Mains"];
const emptyForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  image_url: "",
  category: "Mains",
};

function getToken() {
  return localStorage.getItem("adminToken") || localStorage.getItem("token");
}

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || result.error || "The server could not complete the request.");
  }
  return result;
}

function formatItem(row) {
  return {
    id: row.id ?? row.item_id,
    name: row.name ?? row.title ?? "Unnamed item",
    description: row.description || "",
    price: Number(row.price || 0),
    image_url: row.image_url || row.image || "",
    category: row.category || row.category_name || "Mains",
  };
}

export default function Menu_Edit() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadMenu() {
    try {
      const response = await fetch(`${API_URL}/menu`);
      const result = await readResponse(response);
      const menu = Array.isArray(result) ? result : result.data || [];
      setItems(menu.map(formatItem));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Could not load menu items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenu();
  }, []);

  const filteredItems = activeCategory === "All"
    ? items
    : items.filter((item) => item.category === activeCategory);

  function openModal(item = null) {
    setError("");
    setFormData(item ? { ...item } : { ...emptyForm });
    setIsModalOpen(true);
  }

  async function saveItem(event) {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      setError("Please sign in with an admin account before adding or editing menu items.");
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      image_url: formData.image_url.trim(),
      category: formData.category,
    };

    try {
      const isEditing = Boolean(formData.id);
      const url = isEditing
        ? `${API_URL}/admin/menu/${formData.id}`
        : `${API_URL}/admin/menu`;
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      await readResponse(response);
      await loadMenu();
      setIsModalOpen(false);
      setFormData({ ...emptyForm });
    } catch (requestError) {
      setError(requestError.message || "Could not save this menu item.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id) {
    const token = getToken();
    if (!token) {
      setError("Please sign in with an admin account before removing menu items.");
      return;
    }
    if (!window.confirm("Remove this item from the menu?")) return;

    setError("");
    try {
      const response = await fetch(`${API_URL}/admin/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await readResponse(response);
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(requestError.message || "Could not remove this menu item.");
    }
  }

  return (
    <div className="menu-edit-container">
      <div className="menu-header">
        <div>
          <h1 className="menu-title">Menu Management</h1>
          <p className="menu-subtitle">Add, edit, or remove items from your menu catalog</p>
        </div>
        <button className="add-btn" type="button" onClick={() => openModal()}>
          + Add New Item
        </button>
      </div>

      {error && <p className="menu-error" role="alert">{error}</p>}

      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`tab-btn ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? <p className="menu-subtitle">Loading menu…</p> : (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-card">
              <div className="card-header">
                <span className="category-badge">{item.category}</span>
                <span className="item-price">${item.price.toFixed(2)}</span>
              </div>
              <h3 className="item-name">{item.name}</h3>
              {item.description && <p className="menu-item-description">{item.description}</p>}
              <div className="card-actions">
                <button className="edit-btn" type="button" onClick={() => openModal(item)}>Edit</button>
                <button className="delete-btn" type="button" onClick={() => deleteItem(item.id)}>Delete</button>
              </div>
            </div>
          ))}
          {!filteredItems.length && <p className="menu-subtitle">No menu items in this category.</p>}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2>{formData.id ? "Edit Menu Item" : "Add New Menu Item"}</h2>
            <form onSubmit={saveItem}>
              <div className="form-group">
                <label htmlFor="menu-name">Item Name</label>
                <input id="menu-name" type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="menu-price">Price ($)</label>
                <input id="menu-price" type="number" min="0" step="0.01" value={formData.price} onChange={(event) => setFormData({ ...formData, price: event.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="menu-category">Category</label>
                <select id="menu-category" value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })}>
                  {categories.filter((category) => category !== "All").map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="menu-description">Description</label>
                <input id="menu-description" type="text" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="menu-image">Image URL</label>
                <input id="menu-image" type="url" value={formData.image_url} onChange={(event) => setFormData({ ...formData, image_url: event.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn" disabled={saving}>{saving ? "Saving…" : "Save Item"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
