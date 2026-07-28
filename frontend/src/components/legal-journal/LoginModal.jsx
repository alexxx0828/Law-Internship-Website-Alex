import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { formatApiError } from '../../services/api';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          data-testid="login-modal-overlay"
        >
          <motion.div
            className="modal-box login-box"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-eyebrow">Owner Access</div>
            <h3 className="modal-title">Sign in to edit</h3>
            <p className="modal-subtitle">Only the journal owner can add or edit entries.</p>

            <form onSubmit={handleSubmit} className="login-form">
              <label className="field-label">Email</label>
              <input
                type="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@journal.com"
                required
                data-testid="login-email-input"
              />

              <label className="field-label">Password</label>
              <input
                type="password"
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                data-testid="login-password-input"
              />

              {error && <div className="field-error" data-testid="login-error">{error}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn modal-btn-ghost"
                  onClick={onClose}
                  data-testid="login-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn modal-btn-primary"
                  disabled={loading}
                  data-testid="login-submit-btn"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
