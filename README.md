# Imagica

Imagica is a modern, fast, and responsive full-stack web application designed for fast, AI-powered image processing and transformation. The platform features an ultra-sleek, glassmorphic UI, real-time image filters, and an intelligent integrated AI Assistant.

## Key Features

- **Secure Authentication:** Robust user login and registration powered by JWT.
- **Image Processing:** Apply classic filters (Grayscale, Sepia, Invert, Blur, Pixelate, Edge Detection) instantly.
- **Smart Image Storage:** Save processed images to your private gallery or publish them to a global public feed.
- **AI Chatbot Assistant:** Built-in AI assistant powered by OpenAI (`gpt-4o-mini`) helping users navigate features and troubleshoot edits.
- **Modern UI:** Built with React, Tailwind CSS, and Framer Motion for beautiful glassmorphism and neon styles.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or newer)
- npm (Node Package Manager)

---

## 🚀 Getting Started

To run the application locally, you will need to set up both the backend (server) and the frontend (client).

### 1. Set up the Backend (Server)

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Configure your Environment Variables:
   Copy the `server/.env.example` file (or make a new file named `.env`) in the `server` directory and fill in your keys:
   ```env
   # Database / Superbase Details
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key

   # OpenAI - Required for the AI Chatbot feature
   OPENAI_API_KEY=sk-proj-your_actual_openai_api_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 2. Set up the Frontend (Client)

1. Open a **new** terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## 🤖 Using the AI Chatbot

The **Imagica AI Assistant** is globally accessible via a floating neon button in the bottom right corner of the application. 

1. **Open the chat**: Click the floating message icon.
2. **Ask a question**: Try asking "How do I upload an image?" or "What filters are available?".
3. **Receive help**: The OpenAI-powered backend will securely process your question using a custom Imagica-focused system prompt and return helpful answers.

*Note: Ensure your `OPENAI_API_KEY` is correctly set in your `server/.env` file, or the chatbot will return a connection error.*

---

## 🌍 Deployment Options

Imagica is structured to be easily deployed on modern cloud platforms.

### Backend Deployment (Render / Heroku)
The backend is a standard Express application. It relies on a SQLite database. 
- You can deploy the `server` folder as a Web Service.
- Ensure you set your Environment Variables (`SUPABASE_URL`, `SUPABASE_KEY`, `OPENAI_API_KEY`, etc.) in the dashboard of your hosting provider.

### Frontend Deployment (Vercel)
The `client` folder is a standard Vite React application.
1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `client`.
3. Vercel will automatically detect Vite and configure the build settings.
4. Deploy!

*(If you are deploying the backend separately, make sure to update the `API_URL` variable in `client/src/config.js` to point to your live backend endpoint before building the frontend).*
