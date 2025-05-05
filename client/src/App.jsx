// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import TextEditor from './components/TextEditor';
import ToneSlider from './components/ToneSlider';
import HistoryControls from './components/HistoryControls';
import useTextToneHistory from './hooks/useTextToneHistory';
import { adjustTextTone } from './services/toneService';
import './App.css';

function App() {
  const {
    currentState,
    history,
    currentIndex,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetToInitial
  } = useTextToneHistory({
    text: 'Enter your text here to adjust its tone. This tool will help you transform your writing style from formal to casual or vice versa.',
    toneLevel: 50
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimerRef = useRef(null);
  
  // Handle tone adjustment
  const handleToneChange = async (newToneLevel) => {
    // Clear any previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new debounce timer
    debounceTimerRef.current = setTimeout(async () => {
      if (currentState.text.trim() === '') return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const adjustedText = await adjustTextTone(currentState.text, newToneLevel);
        addToHistory({
          text: adjustedText,
          toneLevel: newToneLevel
        });
      } catch (err) {
        console.error('Error adjusting tone:', err);
        setError('Failed to adjust text tone. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce delay
  };

  // Handle text changes
  const handleTextChange = (newText) => {
    addToHistory({
      ...currentState,
      text: newText
    });
  };
  
  // Handle Reset
  const handleReset = () => {
    resetToInitial();
  };
  
  // Save to local storage when state changes
  useEffect(() => {
    localStorage.setItem('toneSliderState', JSON.stringify({
      currentState,
      history,
      currentIndex
    }));
  }, [currentState, history, currentIndex]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Tone Slider Text Tool</h1>
      </header>
      
      <main className="app-main">
        <div className="editor-section">
          <TextEditor
            text={currentState.text}
            onTextChange={handleTextChange}
            isLoading={isLoading}
          />
        </div>
        
        <div className="controls-section">
          <ToneSlider
            value={currentState.toneLevel}
            onChange={handleToneChange}
            disabled={isLoading}
          />
          
          <HistoryControls
            onUndo={undo}
            onRedo={redo}
            onReset={handleReset}
            canUndo={canUndo}
            canRedo={canRedo}
            disabled={isLoading}
          />
          
          {error && <div className="error-message">{error}</div>}
        </div>
      </main>
    </div>
  );
}

export default App;