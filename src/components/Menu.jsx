import { useEffect, useState } from 'react';
import useMenu from '../hooks/useMenu.js';
import './Menu.css';

export default function Menu({ onAddToCart }) {
  const {menu, loading, error} = useMenu();
  const [addedItemName, setAddedItemName] = useState('');

  useEffect(() => {
    if (!addedItemName) return undefined;
    const timeout = setTimeout(() => setAddedItemName(''), 2500);
    return () => clearTimeout(timeout);
  }, [addedItemName]);

  function handleAddToCart(item) {
    onAddToCart?.(item);
    setAddedItemName(item.title);
  }

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="section">
      {addedItemName && (
        <div className="cart-toast" >
          <span className="cart-toast-check" >✓</span>
          {addedItemName} added to cart
        </div>
      )}
      <div className="section-header">
        <h2>🥙 King Kebab Menu</h2>

        <span className="diet-legend">
          G = Gluten-free | L = Lactose-free | M = Milk-free
        </span>
      </div>

      <div className="grid">
        {menu.map((item) => (
          <div
            key={item.id}
            className="card"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="card-img"
              />
            )}

            <div className="card-header">
              <h4>{item.title}</h4>

              <span className="price">
                €{Number(item.price).toFixed(2)}
              </span>
            </div>

            <p className="card-desc">
              {item.description}
            </p>

            <div className="card-footer">
              <div className="tags">
                {item.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="add-btn" type="button" onClick={() => handleAddToCart(item)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
