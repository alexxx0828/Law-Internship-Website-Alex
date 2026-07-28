import React, { useRef, useLayoutEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import './Editable.css';

/**
 * Editable text segment.
 * - Public visitors see plain text.
 * - Logged-in owner can click to edit; saves on blur.
 *
 * The admin branch is a fully UNCONTROLLED contentEditable: React never renders
 * the text as a child (so it can never wipe the caret / typing on a re-render).
 * We set the DOM text imperatively via a ref, and only when the element is NOT
 * focused, so typing is always preserved.
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

  // Keep the DOM text in sync with the stored value, but never while the user
  // is actively editing (prevents caret jump / wiping typed text on re-render).
  useLayoutEffect(() => {
    if (!isAdmin) return;
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== value) {
      el.textContent = value;
    }
  }, [value, isAdmin]);

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
    // Enter commits (blur). Shift+Enter allows a newline.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  // No React children here — text is managed imperatively via the ref/useEffect.
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
    />
  );
};

export default Editable;
