// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { default as MistralClient } from '@mistralai/mistralai';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Initialize Mistral AI client
const mistralClient = new MistralClient(process.env.MISTRAL_API_KEY);

// Simple in-memory cache
const cache = new Map();

// Cache middleware
const cacheMiddleware = (req, res, next) => {
  const { text, toneLevel } = req.body;
  const cacheKey = `${text.substring(0, 100)}_${toneLevel}`;
  
  if (cache.has(cacheKey)) {
    console.log('Cache hit for:', cacheKey);
    return res.json(cache.get(cacheKey));
  }
  
  console.log('Cache miss for:', cacheKey);
  
  // Attach cache key to request for later use
  req.cacheKey = cacheKey;
  next();
};

// Rate limiting variables
const requestCounts = new Map();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Rate limiting middleware
const rateLimitMiddleware = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  // Initialize or clean up old requests
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }
  
  // Filter out requests older than the rate window
  const requests = requestCounts.get(ip).filter(time => now - time < RATE_WINDOW);
  
  // Check if user has exceeded rate limit
  if (requests.length >= RATE_LIMIT) {
    return res.status(429).json({ 
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.' 
    });
  }
  
  // Add current request timestamp
  requests.push(now);
  requestCounts.set(ip, requests);
  
  next();
};

// Helper function to create Mistral prompt based on tone level
const createTonePrompt = (text, toneLevel) => {
  let toneDescription;
  
  if (toneLevel < 25) {
    toneDescription = "formal, professional, academic style with complex vocabulary and sentence structures";
  } else if (toneLevel < 50) {
    toneDescription = "professional but approachable style with standard business vocabulary";
  } else if (toneLevel < 75) {
    toneDescription = "conversational, friendly style with everyday vocabulary";
  } else {
    toneDescription = "casual, relaxed style with simple sentences and colloquial expressions";
  }
  
  return `Please rewrite the following text to adjust its tone to be ${toneDescription}. 
Maintain the original meaning and information, but change the style, word choice, and sentence structure to match the requested tone.
Keep the length similar to the original text.

Original text:
${text}

Rewritten text with adjusted tone:`;
};

// API endpoint to adjust text tone
app.post('/api/adjust-tone', rateLimitMiddleware, cacheMiddleware, async (req, res) => {
  try {
    const { text, toneLevel } = req.body;
    
    // Validate input
    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        error: 'Invalid input',
        message: 'Text cannot be empty' 
      });
    }
    
    if (typeof toneLevel !== 'number' || toneLevel < 0 || toneLevel > 100) {
      return res.status(400).json({ 
        error: 'Invalid input',
        message: 'toneLevel must be a number between 0 and 100' 
      });
    }
    
    // Create prompt for Mistral AI
    const prompt = createTonePrompt(text, toneLevel);
    
    // Call Mistral AI API
    const response = await mistralClient.chat({
      model: "mistral-small",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    });
    
    const adjustedText = response.choices[0].message.content.trim();
    
    // Save to cache
    const result = { adjustedText };
    cache.set(req.cacheKey, result);
    
    // Limit cache size
    if (cache.size > 100) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error calling Mistral AI:', error);
    
    // Handle different types of errors
    if (error.response && error.response.status === 429) {
      return res.status(429).json({
        error: 'Rate limit',
        message: 'API rate limit exceeded. Please try again later.'
      });
    }
    
    if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to connect to the AI service. Please try again later.'
      });
    }
    
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while adjusting the text tone.'
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});