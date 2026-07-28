import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';
import './AdminBar.css';

const AdminBar = () => {
  const { user, isAdmin, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  // user === null means still checking session
  return (
    <>
      <motion.div
        className="admin-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {isAdmin ? (
          <div className="admin-bar-inner">
            <span className="admin-badge" data-testid="admin-badge">Editing as {user?.name || 'Owner'}</span>
            <button className="admin-btn" onClick={logout} data-testid="logout-btn">
              Log out
            </button>
          </div>
        ) : (
          <button
            className="admin-btn admin-btn-login"
            onClick={() => setLoginOpen(true)}
            data-testid="owner-login-btn"
          >
            Owner Login
          </button>
        )}
      </motion.div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default AdminBar;
