import { useEffect, useState } from 'react';

export default function useMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);

        const response = await fetch('http://localhost:3006/api/menu');

        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }

        const data = await response.json();
        setMenu(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  return {
    menu,
    loading,
    error,
  };
}