// src/components/HistoryControls.jsx
import React from 'react';

/**
 * Controls for history navigation (undo/redo) and reset
 * @param {function} onUndo - Callback for undo action
 * @param {function} onRedo - Callback for redo action
 * @param {function} onReset - Callback for reset action
 * @param {boolean} canUndo - Whether undo is available
 * @param {boolean} canRedo - Whether redo is available
 * @param {boolean} disabled - Whether controls are disabled
 */
function HistoryControls({ onUndo, onRedo, onReset, canUndo, canRedo, disabled }) {
  return (
    <div className="history-controls">
      <button 
        onClick={onUndo} 
        disabled={!canUndo || disabled}
        className="history-button undo-button"
        title="Undo"
      >
        <span className="icon">↩</span>
        <span>Undo</span>
      </button>
      
      <button 
        onClick={onReset} 
        disabled={disabled}
        className="reset-button"
        title="Reset to default"
      >
        <span>Reset</span>
      </button>
      
      <button 
        onClick={onRedo} 
        disabled={!canRedo || disabled}
        className="history-button redo-button"
        title="Redo"
      >
        <span>Redo</span>
        <span className="icon">↪</span>
      </button>
    </div>
  );
}

export default HistoryControls;