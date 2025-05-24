import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal'; // pastikan path sesuai

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = async () => {
  try {
    const res = await fetch('/api/logout', {
      method: 'GET',
      credentials: 'include', // penting agar cookie session ikut terkirim
    });
    if (res.ok) {
      setShowConfirm(false);
      navigate('/login');
    } else {
      alert('Logout gagal, coba lagi.');
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('Logout gagal, coba lagi.');
  }
};

  return (
    <>
      <nav className="flex flex-col divide-y divide-gray-200 bg-white w-72 px-2 py-4 shadow-md rounded-md">
        <Link
          to="overview"
          className={`px-4 py-3 transition ${
            isActive('overview') ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-green-50 text-gray-700 hover:text-green-600'
          }`}
        >
          📊 Overview
        </Link>
        <Link
          to="apikeylist"
          className={`px-4 py-3 transition ${
            isActive('apikeylist') ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-green-50 text-gray-700 hover:text-green-600'
          }`}
        >
          🔑 List ApiKey
        </Link>
        <Link
          to="account"
          className={`px-4 py-3 transition ${
            isActive('account') ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-green-50 text-gray-700 hover:text-green-600'
          }`}
        >
          ⚙️ Account Settings
        </Link>

        <button
          onClick={() => setShowConfirm(true)}
          className="text-left px-4 py-3 transition hover:bg-red-50 text-gray-700 hover:text-red-600 w-full"
        >
          🚪 Logout
        </button>
      </nav>

      <ConfirmModal
        isOpen={showConfirm}
        title="Konfirmasi Logout"
        message="Apakah kamu yakin ingin logout?"
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

export default Sidebar;
