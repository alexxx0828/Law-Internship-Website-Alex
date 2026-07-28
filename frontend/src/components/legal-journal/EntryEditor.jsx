import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '../../services/api';
import './EntryEditor.css';

const emptyEntry = {
  practicum: 'practicum1',
  week: 1,
  date: '',
  title: '',
  description: '',
  tags: [],
  photos: [],
};

const EntryEditor = ({ isOpen, onClose, onSave, initialEntry, activePracticum }) => {
  const [form, setForm] = useState(emptyEntry);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (initialEntry) {
        setForm({ ...emptyEntry, ...initialEntry });
      } else {
        setForm({ ...emptyEntry, practicum: activePracticum || 'practicum1' });
      }
      setTagInput('');
    }
  }, [isOpen, initialEntry, activePracticum]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      updateField('tags', [...form.tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => updateField('tags', form.tags.filter((t) => t !== tag));

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const compressed = await Promise.all(
        files.map(async (file) => ({
          data: await compressImage(file),
          caption: '',
        }))
      );
      updateField('photos', [...form.photos, ...compressed]);
    } catch (err) {
      console.error('Image compression failed', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updateCaption = (index, caption) => {
    const photos = [...form.photos];
    photos[index] = { ...photos[index], caption };
    updateField('photos', photos);
  };

  const removePhoto = (index) => {
    updateField('photos', form.photos.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.date.trim()) return;
    setSaving(true);
    try {
      await onSave({ ...form, week: parseInt(form.week) || 1 });
      onClose();
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
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
          data-testid="entry-editor-overlay"
        >
          <motion.div
            className="modal-box editor-box"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-eyebrow">{initialEntry ? 'Edit Entry' : 'New Entry'}</div>
            <h3 className="modal-title">{initialEntry ? 'Update your day' : 'Add a diary entry'}</h3>

            <div className="editor-scroll">
              <div className="editor-row">
                <div className="editor-col">
                  <label className="field-label">Practicum</label>
                  <select
                    className="field-input"
                    value={form.practicum}
                    onChange={(e) => updateField('practicum', e.target.value)}
                    data-testid="entry-practicum-select"
                  >
                    <option value="practicum1">Practicum I</option>
                    <option value="practicum2">Practicum II</option>
                  </select>
                </div>
                <div className="editor-col">
                  <label className="field-label">Week</label>
                  <select
                    className="field-input"
                    value={form.week}
                    onChange={(e) => updateField('week', e.target.value)}
                    data-testid="entry-week-select"
                  >
                    {[1, 2, 3, 4].map((w) => (
                      <option key={w} value={w}>Week {w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="field-label">Date</label>
              <input
                type="date"
                className="field-input"
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
                data-testid="entry-date-input"
              />

              <label className="field-label">Title</label>
              <input
                type="text"
                className="field-input"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Court Observation: Civil Proceedings"
                data-testid="entry-title-input"
              />

              <label className="field-label">Your experience</label>
              <textarea
                className="field-input field-textarea"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Write about what you did, learned, and observed today…"
                rows={5}
                data-testid="entry-description-input"
              />

              <label className="field-label">Category tags</label>
              <div className="tag-input-row">
                <input
                  type="text"
                  className="field-input tag-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="e.g. Research, Drafting, Court Attendance"
                  data-testid="entry-tag-input"
                />
                <button type="button" className="tag-add-btn" onClick={addTag} data-testid="entry-add-tag-btn">
                  Add
                </button>
              </div>
              <div className="tag-list">
                {form.tags.map((tag) => (
                  <span key={tag} className="editor-tag" onClick={() => removeTag(tag)}>
                    {tag} <span className="tag-remove">×</span>
                  </span>
                ))}
              </div>

              <label className="field-label">Photos</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="file-input"
                data-testid="entry-photo-input"
              />
              {uploading && <div className="upload-status">Processing images…</div>}
              <div className="photo-grid">
                {form.photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img src={photo.data} alt={`upload ${index}`} className="photo-thumb" />
                    <button
                      type="button"
                      className="photo-remove"
                      onClick={() => removePhoto(index)}
                      data-testid={`entry-remove-photo-${index}`}
                    >
                      ×
                    </button>
                    <input
                      type="text"
                      className="photo-caption"
                      value={photo.caption}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      placeholder="Caption…"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions editor-actions">
              <button type="button" className="modal-btn modal-btn-ghost" onClick={onClose} data-testid="entry-cancel-btn">
                Cancel
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-primary"
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.date.trim()}
                data-testid="entry-save-btn"
              >
                {saving ? 'Saving…' : 'Save entry'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryEditor;
