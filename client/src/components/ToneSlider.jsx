// src/components/ToneSlider.jsx
import React from 'react';

/**
 * Tone slider component that allows adjusting the tone level
 * @param {number} value - Current tone level value (0-100)
 * @param {function} onChange - Callback when slider value changes
 * @param {boolean} disabled - Whether the slider is disabled
 */
function ToneSlider({ value, onChange, disabled }) {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(newValue);
  };

  // Calculate tone label based on value
  const getToneLabel = (val) => {
    if (val < 25) return 'Formal';
    if (val < 50) return 'Professional';
    if (val < 75) return 'Conversational';
    return 'Casual';
  };

  return (
    <div className="tone-slider-container">
      <h2>Tone Adjustment</h2>
      
      <div className="slider-labels">
        <span>Formal</span>
        <span className="current-tone">{getToneLabel(value)}</span>
        <span>Casual</span>
      </div>
      
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="tone-slider"
        disabled={disabled}
      />
      
      <div className="tone-value">
        <span>Current level: {value}%</span>
      </div>
    </div>
  );
}

export default ToneSlider;