import menuData from "./data/menu.json";

export default function Menu() {
  return (
    <section className="section">
      <div className="section-header">
        <h2>🥙 King Kebab Menu</h2>
        <span className="diet-legend">
          G = Gluten-free | L = Lactose-free | M = Milk-free
        </span>
      </div>

      <div className="grid">
        {menuData.map((item) => (
          <div
            key={item.id}
            className={`card ${item.highlighted ? "highlighted" : ""}`}>
            {item.badgeText && (
              <span className="today-badge">{item.badgeText}</span>
            )}

            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="card-img"
              />
            )}

            <div className="card-header">
              <h4>{item.title}</h4>
              <span className="price">{item.price}</span>
            </div>

            <p className="card-desc">{item.description}</p>

            <div className="card-footer">
              <div className="tags">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="add-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
