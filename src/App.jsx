import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './layout/Header';
import Content from './layout/Content';
import Footer from './layout/Footer';
import LoginSignup from './LoginSignup/LoginSignup';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <div className="app-container">
              <Header />
              <Content />
              <Footer />
            </div>
          }
        />

        <Route
          path="/login"
          element={<LoginSignup />}
        />

      </Routes>
    </BrowserRouter>
  );
}