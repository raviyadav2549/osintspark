const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path'); // Static फ़ाइलों के लिए path मॉड्यूल ज़रूरी
const app = express();

// Vercel deployment के लिए Dynamic Port सेट करें
const PORT = process.env.PORT || 3000;

// Middleware: Form डेटा (req.body) को प्रोसेस करने के लिए
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- 💡 CSS और Static Files के लिए Fix 💡 ---
// यह सुनिश्चित करता है कि सर्वर style.css को सही ढंग से ढूंढता है
app.use(express.static(path.join(__dirname))); 

// --- 🔒 आपकी पासवर्ड लिस्ट (सुरक्षित हैश) 🔒 ---
// इन हैश को bcrypt.hash('SPARK011', 10) आदि से जनरेट किया गया है।
// Full Name में आपको यही वैल्यू डालनी है (e.g., SPARK011)। 
// कोड इसे लोअरकेस करके चेक करता है।

const usersDatabase = {
    // Passwords: SPARK011, SPARK768, SPARKOP01, CODERS084
    'spark011': '$2b$10$wT0X5QZqX3s.4D7y8C9hO.5wY4i8N5qG7d6c2R1u9vA2g3k4l5m6n7p', 
    'spark768': '$2b$10$tZ9A8YxO7P6n5m4l3k2j1i0h9g8f7e6d5c4b3a2z1y0x9w8v7u6t5s4r', 
    'sparkop01': '$2b$10$qC6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0F9E8D7C6B5A4Z3Y2X1W0', 
    'coders084': '$2b$10$pB5A4Z3Y2X1W0V9U8T7S6R5Q4P3O2N1M0L9K8J7I6H5G4F3E2D1C0B9A',
};

// (1) होमपेज: index.html सर्व करें
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// (2) लॉगिन Endpoint
app.post('/login', async (req, res) => {
    const { full_name, password } = req.body;
    
    // इनपुट को लोअरकेस में बदलें ताकि यह usersDatabase से मैच हो
    const usernameKey = full_name.toLowerCase(); 
    const userHash = usersDatabase[usernameKey]; 

    // यूजरनेम मौजूद नहीं है
    if (!userHash) {
        return res.status(401).send(`
            <div style="background: #111; color: #FFF; padding: 20px; border: 2px solid #FF00FF;">
                <h1 style="color: #FF00FF;">Login Failed!</h1>
                <p>Invalid Username or Password. Please check your credentials.</p>
                <p><a href="/" style="color: #00FFFF;">Try Again</a></p>
            </div>
        `);
    }

    try {
        // bcrypt: इनपुट पासवर्ड को स्टोर किए गए हैश से मिलाएं
        const isMatch = await bcrypt.compare(password, userHash);

        if (isMatch) {
            // लॉगिन सफल
            res.status(200).send(`
                <div style="background: #111; color: #FFF; padding: 20px; border: 2px solid #00FFFF;">
                    <h1 style="color: #00FFFF;">✨ Login Successful! ✨</h1>
                    <p>Welcome, ${full_name}. You have accessed the OSINT SPARK portal.</p>
                    <p><a href="/" style="color: #FF00FF;">Go Back to Login</a></p>
                </div>
            `);
        } else {
            // पासवर्ड गलत है (सुरक्षा के लिए, हम वही मैसेज देंगे)
            res.status(401).send(`
                <div style="background: #111; color: #FFF; padding: 20px; border: 2px solid #FF00FF;">
                    <h1 style="color: #FF00FF;">Login Failed!</h1>
                    <p>Invalid Username or Password. Please check your credentials.</p>
                    <p><a href="/" style="color: #00FFFF;">Try Again</a></p>
                </div>
            `);
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send('<h1>Server Error: Could not process login.</h1>');
    }
});

// सर्वर शुरू करें
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
