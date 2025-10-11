import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
  const { user, isAuthenticated, devSignIn, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <p className="text-gray-300 mb-4">You are not logged in.</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-500 transition-colors"
          >
            Go to Login
          </button>
          <button
            onClick={devSignIn}
            className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
            title="Temporary dev sign-in"
          >
            Dev Sign-In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">My Account</h2>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-gray-400 text-sm">Username</div>
            <div className="text-white font-medium">{user?.username}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Role</div>
            <div className="text-white font-medium capitalize">{user?.role}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-gray-400 text-sm">Email</div>
            <div className="text-white font-medium">{user?.email || '—'}</div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
