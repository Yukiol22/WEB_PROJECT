import Map from '../components/Map';
import './Content.css';

export default function Content() {
  return (
    <main className="content-container">
      <section className="section">
        <h3>📍 Restaurant Location</h3>
        <Map />
      </section>
    </main>
  );
}