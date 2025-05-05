// src/services/toneService.js

/**
 * Handles API calls to adjust text tone
 */

// Cache for API responses to reduce redundant calls
const responseCache = new Map();

// Create a cache key from text and tone level
const getCacheKey = (text, toneLevel) => {
  return `${text.substring(0, 100)}_${toneLevel}`;
};

// API base URL
const API_BASE_URL = 'http://localhost:3000';

/**
 * Adjust the tone of the provided text
 * @param {string} text - The text to adjust
 * @param {number} toneLevel - The tone level (0-100) where 0 is formal and 100 is casual
 * @returns {Promise<string>} - Promise resolving to the adjusted text
 */
export const adjustTextTone = async (text, toneLevel) => {
  // Don't make API calls for empty text
  if (!text.trim()) {
    return text;
  }
  
  // Check cache first
  const cacheKey = getCacheKey(text, toneLevel);
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/adjust-tone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, toneLevel }),
    });
    
    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    responseCache.set(cacheKey, data.adjustedText);
    
    // Limit cache size to prevent memory issues
    if (responseCache.size > 50) {
      const oldestKey = responseCache.keys().next().value;
      responseCache.delete(oldestKey);
    }
    
    return data.adjustedText;
  } catch (error) {
    console.error('Failed to adjust text tone:', error);
    throw error;
  }
};

/**
 * Clear the response cache
 */
export const clearCache = () => {
  responseCache.clear();
};