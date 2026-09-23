
import Header from './layout/Header';
import Content from './layout/Content';
import Footer from './layout/Footer';
import LoginSignup from './LoginSignup/LoginSignup';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <Content />
      <Footer />
      <LoginSignup />

    </div>
  );
}