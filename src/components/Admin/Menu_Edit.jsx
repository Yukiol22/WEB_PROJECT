import { useState } from "react";
import "./Menu_Edit.css";

// Initial data based on categories and menu_items tables
const initialCategories = [
  { category_id: 1, name: "All" },
  { category_id: 2, name: "Mains" },
  { category_id: 3, name: "Sides" },
  { category_id: 4, name: "Drinks" },
  { category_id: 5, name: "Desserts" },
];

const initialMenuItems = [
  {
    item_id: 1,
    category_id: 2,
    name: "Double Cheeseburger",
    price: 12.99,
    category_name: "Mains",
  },
  {
    item_id: 2,
    category_id: 2,
    name: "Margherita Pizza",
    price: 14.5,
    category_name: "Mains",
  },
  {
    item_id: 3,
    category_id: 3,
    name: "French Fries",
    price: 4.99,
    category_name: "Sides",
  },
  {
    item_id: 4,
    category_id: 4,
    name: "Iced Milk Tea",
    price: 3.8,
    category_name: "Drinks",
  },
];

export default function Menu_Edit() {
  const [items, setItems] = useState(initialMenuItems);
  const [activeCategory, setActiveCategory] = useState("All");

  // Modal State for Adding/Editing Items
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_id: null,
    name: "",
    price: "",
    category_id: 2,
  });

  // Filter items by category
  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category_name === activeCategory);

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ item_id: null, name: "", price: "", category_id: 2 });
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const selectedCategory = initialCategories.find(
      (c) => c.category_id === Number(formData.category_id),
    );

    if (formData.item_id) {
      // Edit existing
      setItems(
        items.map((i) =>
          i.item_id === formData.item_id
            ? { ...formData, category_name: selectedCategory.name }
            : i,
        ),
      );
    } else {

      const newItem = {
        ...formData,
        item_id: Date.now(),
        price: parseFloat(formData.price),
        category_name: selectedCategory.name,
      };
      setItems([...items, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.item_id !== id));
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
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + Add New Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {initialCategories.map((cat) => (
          <button
            key={cat.category_id}
            className={`tab-btn ${activeCategory === cat.name ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
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
                onClick={() => handleDeleteItem(item.item_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
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
                  {initialCategories
                    .filter((c) => c.name !== "All")
                    .map((c) => (
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
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
