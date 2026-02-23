const express = require('express');
const router = express.Router();

let openai;
try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} catch (e) {
    console.warn('[Chat API] OpenAI module not loaded:', e.message);
}

// ── LOCAL FAQ FALLBACK ──────────────────────────────────────────
const FAQ = [
    { keys: ['what is imagica', 'about imagica'], answer: 'Imagica is an online image transformation platform that allows users to upload and apply various visual styles and effects to their images easily.' },
    { keys: ['free', 'cost', 'price', 'pricing'], answer: 'Imagica provides core transformation features for free. Additional premium features may be introduced in the future.' },
    { keys: ['account', 'register', 'sign up', 'login'], answer: 'You need to create a free account to access the Studio and save your work. Registration takes less than a minute.' },
    { keys: ['format', 'jpg', 'png', 'webp', 'file type'], answer: 'Imagica supports JPG, PNG, and WebP image formats.' },
    { keys: ['upload', 'how to upload', 'upload image'], answer: 'In the Studio, click the canvas area and either drag & drop your image or click "Browse Files". You can also use your webcam by clicking "Take Photo".' },
    { keys: ['filter', 'effect', 'grayscale', 'sepia', 'blur', 'sharpen', 'brightness', 'contrast', 'edge', 'vintage', 'invert', 'pixelate'], answer: 'Imagica offers 10 professional filters: Grayscale, Sepia, Blur, Sharpen, Brightness, Contrast, Edge Detection, Vintage, Invert, and Pixelate. Select one or more after uploading your image, then click "GENERATE MASTERPIECE".' },
    { keys: ['download', 'save', 'export'], answer: 'After processing, click the "DOWNLOAD" button to save your image. You can also click "SAVE TO POSTS" to store it in your private gallery.' },
    { keys: ['public', 'share', 'publish', 'feed'], answer: 'Go to "Your Posts" tab, find your image, and click "Publish" to share it to the Public Feed where all users can see it.' },
    { keys: ['posts', 'gallery', 'my images', 'saved'], answer: 'Your saved images appear in the "Your Posts" tab. You can manage visibility (public/private) for each one.' },
    { keys: ['slow', 'processing', 'how long'], answer: 'Processing usually takes 2-5 seconds depending on image size and the selected effects.' },
    { keys: ['mobile', 'phone', 'tablet'], answer: 'Imagica works on modern mobile and desktop browsers, though the Studio is optimized for desktop use.' },
    { keys: ['safe', 'secure', 'privacy', 'data'], answer: 'Yes, Imagica prioritizes secure handling. Your images are processed privately and not shared without your permission.' },
    { keys: ['delete', 'remove'], answer: 'To delete data, please contact rithwikgoud006@gmail.com.' },
    { keys: ['bug', 'issue', 'problem', 'error', 'not working', 'broken'], answer: 'Sorry to hear that! Please report any bugs or issues to rithwikgoud006@gmail.com and we will fix them promptly.' },
    { keys: ['contact', 'support', 'help', 'email'], answer: 'For support, reach out to rithwikgoud006@gmail.com.' },
    { keys: ['tool', 'tool dock', 'select', 'draw', 'brush'], answer: 'The Tool Dock on the left side gives you quick access to Select and Draw tools for canvas interactions.' },
    { keys: ['opacity', 'properties', 'panel'], answer: 'The Properties Panel on the right lets you adjust Opacity and Blur Intensity of your image in real time.' },
    { keys: ['camera', 'webcam', 'photo'], answer: 'Click "Take Photo" in the upload area to use your webcam and capture an image directly into the Studio.' },
    { keys: ['install', 'app', 'download app'], answer: 'Imagica works directly in your browser — no installation required!' },
    { keys: ['browser', 'chrome', 'firefox', 'safari', 'edge'], answer: 'Imagica works best on modern browsers: Chrome, Edge, Firefox, and Safari.' },
];

function localFallback(message) {
    const lower = message.toLowerCase();
    for (const entry of FAQ) {
        if (entry.keys.some(k => lower.includes(k))) {
            return entry.answer;
        }
    }
    return "I'm not sure about that yet. For further information, please contact rithwikgoud006@gmail.com.";
}

// ── SYSTEM PROMPT ───────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the Imagica Studio Assistant. Help users understand and use Imagica — a professional image editing platform.

Key features:
- 10 filters: Grayscale, Sepia, Blur, Sharpen, Brightness, Contrast, Edge Detection, Vintage, Invert, Pixelate
- Desktop Studio Layout with canvas, tool dock (Select/Draw), and properties panel (Opacity/Blur sliders)
- Save to Posts gallery or publish to Public Feed
- Webcam capture support
- Supports JPG, PNG, WebP

Workflow: Upload image → Choose filters → Click GENERATE MASTERPIECE → Download or Save.

Reply concisely and helpfully. If you don't know, say: "For further assistance, contact rithwikgoud006@gmail.com."`;

// ── ROUTE ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required and cannot be empty' });
    }

    // Try OpenAI first
    if (openai && process.env.OPENAI_API_KEY) {
        try {
            const formattedHistory = history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...formattedHistory,
                    { role: 'user', content: message }
                ],
                max_tokens: 250,
                temperature: 0.7,
            });

            const reply = completion.choices[0].message.content;
            console.log(`[Chat API] OpenAI replied to: "${message.substring(0, 40)}"`);
            return res.json({ reply });

        } catch (error) {
            console.warn('[Chat API] OpenAI failed, using local fallback. Error:', error.message);
            // Fall through to local fallback below
        }
    }

    // Local FAQ fallback
    const reply = localFallback(message);
    console.log(`[Chat API] Local fallback reply for: "${message.substring(0, 40)}"`);
    return res.json({ reply });
});

module.exports = router;

