const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// System prompt defining the AI Assistant's role and knowledge
const SYSTEM_PROMPT = `You are **Imagica AI Assistant**. You help users of the Imagica web application understand and use the app's features. 

Core capabilities of Imagica include:
- Image Uploads: Users can upload images to process.
- Classic Filters: Users can apply multiple filters like grayscale, sepia, invert, blur, sketch, brightness, etc.
- Smart Processing: The app provides fast, real-time image manipulation.
- Save & Publish: Users can save their processed images to their private "Your Posts" gallery or publish them to the "Public Feed".
- Fast & Secure: Processing is optimized and secure.

Your job is to explain how to upload images, apply edits, select styles, and troubleshoot common issues within the context of Imagica. 
Reply politely, concisely, and helpfully. Do not make up features that are not listed here. If asked about AI Anime generation, mention that it has been deprecated in favor of a simpler, more stable classic processing experience.

**CRITICAL FAQ KNOWLEDGE BASE (Always use these exact answers if asked):**
Q: "Is it a paid and ad-free experience?"
A: "Imagica is completely free to use and ad-free."

Q: "Who built Imagica?"
A: "Imagica was built by Rithwik Goud."

Q: "Are images saved locally?"
A: "No, images are securely saved to cloud databases like Firebase Storage and Supabase."`;

/**
 * @route POST /api/chat
 * @desc Get an intelligent response from the Imagica AI Assistant
 * @access Public (or add authentication middleware if needed later)
 */
router.post('/', async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required and cannot be empty' });
    }

    if (!process.env.OPENAI_API_KEY) {
        console.error('[Chat API] Missing OPENAI_API_KEY environment variable');
        return res.status(500).json({
            error: 'Chatbot is not configured properly on the server. Missing API Key.'
        });
    }

    try {
        console.log(`[Chat API] Received message: "${message.substring(0, 50)}..."`);

        // Format history for OpenAI
        const formattedHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        // Construct the full message array
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...formattedHistory,
            { role: "user", content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Recommended fast/cheap model
            messages: messages,
            max_tokens: 300,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        res.json({ reply });

    } catch (error) {
        console.error('[Chat API] Error during OpenAI completion:', error.message);

        if (error.response) {
            console.error('[Chat API] OpenAI Status:', error.response.status);
            console.error('[Chat API] OpenAI Data:', error.response.data);
        }

        res.status(500).json({
            error: 'Failed to generate a response',
            details: error.message
        });
    }
});

module.exports = router;
