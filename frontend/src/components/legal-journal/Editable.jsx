import React, { useRef } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import './Editable.css';

/**
 * Editable text segment.
 * - Public visitors see plain text.
 * - Logged-in owner can click to edit; saves on blur.
 *
 * Props:
 *  - k: content key (required)
 *  - as: HTML tag (default 'span')
 *  - className, style: passthrough
 */
const Editable = ({ k, as = 'span', className = '', style }) => {
  const { content, updateContent } = useContent();
  const { isAdmin } = useAuth();
  const ref = useRef(null);

  const value = content[k] !== undefined ? content[k] : '';
  const Tag = as;

  if (!isAdmin) {
    return (
      <Tag className={className} style={style} data-testid={`editable-${k}`}>
        {value}
      </Tag>
    );
  }

  const handleBlur = (e) => {
    const text = e.currentTarget.textContent;
    if (text !== value) {
      updateContent(k, text);
    }
  };

  const handleKeyDown = (e) => {
    // For single-line-ish fields, Enter commits (blur). Shift+Enter allows newline.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      className={`${className} editable`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-testid={`editable-${k}`}
      style={style}
      title="Click to edit"
    >
      {value}
    </Tag>
  );
};

export default Editable;
