import Map from "../components/Map";
import Menu from "../components/Menu";
import "./Content.css";

export default function Content({ currentPage }) {
  return (
    <main className="content-container">
      {currentPage === "menu" ?
        <Menu />
      : <section className="section">
          <h3>📍 Restaurant Location</h3>
          <Map />
        </section>
      }
    </main>
  );
}
