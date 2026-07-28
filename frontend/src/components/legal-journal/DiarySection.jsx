import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../../context/AuthContext';
import { getEntriesApi, createEntryApi, updateEntryApi, deleteEntryApi } from '../../services/api';
import EntryEditor from './EntryEditor';
import Lightbox from './Lightbox';
import Editable from './Editable';
import './DiarySection.css';

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d
    .toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
};

const DiarySection = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('practicum1');
  const [activeWeek, setActiveWeek] = useState('all');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Lightbox state: { photos: [], index: number } | null
  const [lightbox, setLightbox] = useState(null);

  const openLightbox = (photos, index) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const navigateLightbox = (index) => setLightbox((lb) => (lb ? { ...lb, index } : lb));

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEntriesApi(activeTab, activeWeek);
      setEntries(data);
    } catch (e) {
      console.error('Failed to fetch entries', e);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, activeWeek]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const notifyChange = () => window.dispatchEvent(new Event('entriesChanged'));

  const handleSave = async (entry) => {
    if (editingEntry) {
      await updateEntryApi(editingEntry.id, entry);
    } else {
      await createEntryApi(entry);
    }
    await fetchEntries();
    notifyChange();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    await deleteEntryApi(id);
    await fetchEntries();
    notifyChange();
  };

  const openNewEntry = () => {
    setEditingEntry(null);
    setEditorOpen(true);
  };

  const openEditEntry = (entry) => {
    setEditingEntry(entry);
    setEditorOpen(true);
  };

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: i * 0.05 },
    }),
  };

  return (
    <section id="diary" className="diary-section section-border">
      <div className="section-container" ref={ref}>
        <motion.div className="section-number" custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={textVariants}>
          03
        </motion.div>

        <div className="diary-header">
          <motion.h2 className="section-heading no-margin" custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={textVariants}>
            <Editable k="diary_heading" />
          </motion.h2>
          {isAdmin && (
            <motion.button
              className="add-entry-btn"
              onClick={openNewEntry}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="add-entry-btn"
            >
              + Add Entry
            </motion.button>
          )}
        </div>

        <motion.div className="diary-controls" custom={2} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={textVariants}>
          <div className="practicum-tabs">
            <button
              className={`tab-btn ${activeTab === 'practicum1' ? 'active' : ''}`}
              onClick={() => { setActiveTab('practicum1'); setActiveWeek('all'); }}
              data-testid="tab-practicum1"
            >
              Practicum I (03/08/2026 – 28/08/2026)
            </button>
            <button
              className={`tab-btn ${activeTab === 'practicum2' ? 'active' : ''}`}
              onClick={() => { setActiveTab('practicum2'); setActiveWeek('all'); }}
              data-testid="tab-practicum2"
            >
              Practicum II (Upcoming)
            </button>
          </div>
        </motion.div>

        {activeTab === 'practicum1' && (
          <div className="week-filters">
            {['all', '1', '2', '3', '4'].map((week) => (
              <button
                key={week}
                className={`week-chip ${activeWeek === week ? 'active' : ''}`}
                onClick={() => setActiveWeek(week)}
                data-testid={`week-chip-${week}`}
              >
                {week === 'all' ? 'All Weeks' : `Week ${week}`}
              </button>
            ))}
          </div>
        )}

        {/* Entries */}
        {loading ? (
          <div className="diary-empty" data-testid="diary-loading">Loading entries…</div>
        ) : entries.length === 0 ? (
          <div className="diary-empty" data-testid="diary-empty">
            {activeTab === 'practicum2' ? (
              <p>Practicum II hasn't started yet. Entries will appear here once it begins.</p>
            ) : (
              <p>
                No entries yet.{' '}
                {isAdmin ? 'Click “+ Add Entry” to record your first day.' : 'The journal begins on 03/08/2026.'}
              </p>
            )}
          </div>
        ) : (
          <motion.div className="diary-entries" layout>
            <AnimatePresence mode="popLayout">
              {entries.map((entry, index) => (
                <motion.article
                  key={entry.id}
                  className="diary-card"
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  data-testid={`diary-card-${entry.id}`}
                >
                  {entry.photos && entry.photos.length > 0 && (
                    <div className="card-photos">
                      <button
                        type="button"
                        className="card-photo-main-btn"
                        onClick={() => openLightbox(entry.photos, 0)}
                        data-testid={`open-photo-${entry.id}`}
                        aria-label="View photos"
                      >
                        <img src={entry.photos[0].data} alt={entry.photos[0].caption || entry.title} className="card-photo-main" />
                        <span className="card-photo-zoom">View</span>
                        {entry.photos[0].caption && (
                          <span className="card-photo-caption">{entry.photos[0].caption}</span>
                        )}
                      </button>

                      {entry.photos.length > 1 && (
                        <div className="card-photo-strip">
                          {entry.photos.slice(1, 5).map((photo, pIdx) => (
                            <button
                              type="button"
                              key={pIdx}
                              className="card-photo-thumb-btn"
                              onClick={() => openLightbox(entry.photos, pIdx + 1)}
                              data-testid={`thumb-${entry.id}-${pIdx + 1}`}
                            >
                              <img src={photo.data} alt={photo.caption || `photo ${pIdx + 2}`} className="card-photo-thumb" />
                              {pIdx === 3 && entry.photos.length > 5 && (
                                <span className="card-photo-more">+{entry.photos.length - 5}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="card-body">
                    <div className="diary-date">{formatDisplayDate(entry.date)} · WEEK {entry.week}</div>
                    <h3 className="diary-title">{entry.title}</h3>
                    <p className="diary-description">{entry.description}</p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="diary-tags">
                        {entry.tags.map((tag) => (
                          <span key={tag} className="diary-tag">{tag}</span>
                        ))}
                      </div>
                    )}

                    {isAdmin && (
                      <div className="card-admin-actions">
                        <button className="card-action-btn" onClick={() => openEditEntry(entry)} data-testid={`edit-entry-${entry.id}`}>
                          Edit
                        </button>
                        <button className="card-action-btn card-action-delete" onClick={() => handleDelete(entry.id)} data-testid={`delete-entry-${entry.id}`}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <EntryEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        initialEntry={editingEntry}
        activePracticum={activeTab}
      />

      <Lightbox
        photos={lightbox?.photos || []}
        index={lightbox ? lightbox.index : null}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </section>
  );
};

export default DiarySection;
