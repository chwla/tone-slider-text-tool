Tone Slider Text Tool
A React application that allows users to adjust the tone of text from formal to casual using a slider interface. Powered by the Mistral AI small model.

Features

Text Editor: Input and edit text with real-time updates
Tone Adjustment: Slide between formal and casual tones
Undo/Redo: Track and revert tone changes
Responsive UI: Works on desktop and mobile devices
Local Storage: Persists state across browser sessions
Error Handling: Gracefully handles API failures and edge cases

Tech Stack

Frontend: React with hooks for state management
Backend: Express.js for handling API calls securely
AI Integration: Mistral AI small model for tone adjustments
Styling: Custom CSS for responsive design

Architecture
The application follows a client-server architecture:

Frontend: React application with the following components:

TextEditor: For inputting and editing text
ToneSlider: For adjusting the tone level
HistoryControls: For undo/redo functionality


Backend: Express.js server that:

Secures the Mistral AI API key
Handles request validation
Implements caching to reduce API calls
Manages rate limiting


State Management:

Uses React hooks (useState, useEffect) and a custom hook for history tracking
Maintains a history stack for undo/redo functionality
Persists state to localStorage



Setup Instructions
Prerequisites

Node.js (v14 or higher)
npm or yarn
Mistral AI API key

Installation

Clone the repository:
bashgit clone https://github.com/your-username/tone-slider-text-tool.git
cd tone-slider-text-tool

Install dependencies for both frontend and backend:
bash# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

Create a .env file in the root directory based on .env.example:
bashcp .env.example .env

Add your Mistral AI API key to the .env file:
MISTRAL_API_KEY=your_mistral_api_key_here


Running the Application
Development Mode

Start the backend server:
bashnpm run server

In a separate terminal, start the frontend development server:
bashcd client
npm start

Open your browser and navigate to http://localhost:3000

Production Mode

Build the React frontend:
bashcd client
npm run build
cd ..

Start the production server:
bashnpm start

Open your browser and navigate to http://localhost:5000

Technical Implementation Details
State Management
The application uses a custom React hook useTextToneHistory to manage the state and history for undo/redo functionality. The hook:

Maintains a history stack of states (text content and tone level)
Tracks the current position in the history stack
Provides methods to navigate through history (undo/redo)
Persists the state to localStorage for session persistence

javascript// Example usage of the custom hook
const {
  currentState,
  addToHistory,
  undo,
  redo,
  canUndo,
  canRedo
} = useTextToneHistory(initialState);
API Integration
The frontend communicates with the backend server using a dedicated service layer that:

Handles API calls to adjust text tone
Implements client-side caching to reduce redundant API calls
Manages error states and provides meaningful error messages

The backend server:

Secures the Mistral AI API key
Formats prompts for the AI model based on tone level
Implements server-side caching to reduce API costs
Handles rate limiting to prevent abuse

Error Handling
The application implements robust error handling at multiple levels:

Frontend:

Validates inputs before making API calls
Provides visual feedback during loading states
Displays meaningful error messages to users
Maintains previous valid state when errors occur


Backend:

Validates request parameters
Handles API timeouts and connection errors
Implements rate limiting with appropriate error responses
Gracefully degrades functionality when services are unavailable



Trade-offs and Decisions

State Management Approach:

Chose to use React's built-in state management (Context API + hooks) instead of Redux for simplicity and to avoid over-engineering
This trade-off works well for this application's scope but might need reconsideration for larger applications with more complex state


Caching Strategy:

Implemented both client-side and server-side caching to reduce API calls
The cache is limited in size to prevent memory issues
This approach improves performance and reduces costs but might result in stale data if the AI model updates


Debouncing:

Added debouncing for tone slider changes to prevent excessive API calls during slider movement
This improves user experience and reduces API costs but adds a slight delay in seeing results



Future Improvements

Add tone presets (e.g., Executive, Technical, Educational)
Implement user accounts to save and load different text versions
Add support for multiple text snippets
Enhance the UI with animations and transitions
Add text analysis features to show statistics about the text