// src/hooks/useTextToneHistory.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to manage the history stack for undo/redo functionality
 * @param {Object} initialState - The initial state object with text and toneLevel
 * @returns {Object} - Methods and state for history management
 */
function useTextToneHistory(initialState) {
  // Try to load from localStorage first
  const loadInitialState = () => {
    try {
      const savedState = localStorage.getItem('toneSliderState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return {
          history: parsedState.history || [initialState],
          currentIndex: parsedState.currentIndex || 0,
          initialState
        };
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    // Fall back to default initial state
    return {
      history: [initialState],
      currentIndex: 0,
      initialState
    };
  };

  const { history: initialHistory, currentIndex: initialIndex, initialState: original } = loadInitialState();
  
  const [history, setHistory] = useState(initialHistory);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Current state is the state at the current index in history
  const currentState = history[currentIndex];
  
  /**
   * Add a new state to history
   * @param {Object} newState - The new state to add
   */
  const addToHistory = (newState) => {
    // If we're not at the end of history, truncate the future states
    const newHistory = history.slice(0, currentIndex + 1);
    
    // Only add to history if the state has actually changed
    if (JSON.stringify(newState) !== JSON.stringify(currentState)) {
      setHistory([...newHistory, newState]);
      setCurrentIndex(newHistory.length);
    }
  };

  /**
   * Move back one step in history
   */
  const undo = () => {
    if (canUndo) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  /**
   * Move forward one step in history
   */
  const redo = () => {
    if (canRedo) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  /**
   * Reset to initial state
   */
  const resetToInitial = () => {
    setHistory([original]);
    setCurrentIndex(0);
  };

  // Can we undo/redo?
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    currentState,
    history,
    currentIndex,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetToInitial
  };
}

export default useTextToneHistory;