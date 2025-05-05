// src/components/TextEditor.jsx
import React from 'react';

/**
 * Text editor component where users can input and edit text
 * @param {string} text - The current text content
 * @param {function} onTextChange - Callback when text changes
 * @param {boolean} isLoading - Whether an API request is in progress
 */
function TextEditor({ text, onTextChange, isLoading }) {
  const handleChange = (e) => {
    onTextChange(e.target.value);
  };

  return (
    <div className="text-editor-container">
      <div className="editor-header">
        <h2>Text Editor</h2>
        {isLoading && (
          <div className="loading-indicator">
            <span>Adjusting tone...</span>
            <div className="spinner"></div>
          </div>
        )}
      </div>
      
      <textarea
        value={text}
        onChange={handleChange}
        className={`text-editor ${isLoading ? 'loading' : ''}`}
        placeholder="Enter your text here..."
        disabled={isLoading}
      />
    </div>
  );
}

export default TextEditor;