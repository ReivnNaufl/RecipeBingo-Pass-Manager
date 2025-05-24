import { useEffect, useState } from 'react';

function Overview() {
  const [userCount, setUserCount] = useState(null);
  const [recipeCount, setRecipeCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, recipeRes] = await Promise.all([
          fetch('/api/userList', { credentials: 'include' }),
          fetch('/api/recipeList', { credentials: 'include' }),
        ]);

        if (!userRes.ok || !recipeRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const users = await userRes.json();
        const recipes = await recipeRes.json();

        setUserCount(Array.isArray(users) ? users.length : 0);
        setRecipeCount(Array.isArray(recipes) ? recipes.length : 0);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
  return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50"></div>
    </div>
  );
  }
  if (error) return <div className="p-4 text-red-600 text-center">Error: {error}</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Overview</h1>

      <div className="mb-4 p-4 bg-green-100 rounded">
        <h2 className="text-xl font-semibold">Account Count</h2>
        <p className="text-2xl">{userCount}</p>
      </div>

      <div className="p-4 bg-blue-100 rounded">
        <h2 className="text-xl font-semibold">Recipe Count</h2>
        <p className="text-2xl">{recipeCount}</p>
      </div>
    </div>
  );
}

export default Overview;
