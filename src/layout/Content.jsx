import Map from '../components/Map';
import './Content.css';
import HslLayout from '../components/HslLayout';

export default function Content() {
  return (
    <main className="content-container">
      <section className="section">
        <h3>📍 Restaurant Location</h3>
        <HslLayout/>
      </section>
    </main>
  );
}