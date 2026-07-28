import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Lightbox.css';

const Lightbox = ({ photos, index, onClose, onNavigate }) => {
  const isOpen = index !== null && index >= 0;

  const handleKey = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % photos.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + photos.length) % photos.length);
    },
    [isOpen, index, photos, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!isOpen) return null;
  const photo = photos[index];
  const hasMultiple = photos.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-testid="lightbox-overlay"
      >
        <button className="lightbox-close" onClick={onClose} data-testid="lightbox-close">×</button>

        {hasMultiple && (
          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + photos.length) % photos.length); }}
            data-testid="lightbox-prev"
          >
            ‹
          </button>
        )}

        <motion.div
          className="lightbox-content"
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={photo.data} alt={photo.caption || 'diary photo'} className="lightbox-image" />
          <div className="lightbox-meta">
            {photo.caption && <p className="lightbox-caption">{photo.caption}</p>}
            {hasMultiple && <span className="lightbox-counter">{index + 1} / {photos.length}</span>}
          </div>
        </motion.div>

        {hasMultiple && (
          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % photos.length); }}
            data-testid="lightbox-next"
          >
            ›
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
