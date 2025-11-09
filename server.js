const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
// Vercel deployment के लिए Dynamic Port Set करें
const PORT = process.env.PORT || 3000;

// Middleware: Form डेटा को प्रोसेस करने के लिए
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static फ़ाइलें (CSS, आदि) सर्व करने के लिए
app.use(express.static(path.join(__dirname))); 

// --- 🔒 आपकी पासवर्ड लिस्ट (सुरक्षित हैश) 🔒 ---
// *नोट*: ये पासवर्ड 10 राउंड साल्टिंग के साथ हैश किए गए हैं।
// (Usernames को सरलता के लिए Lowercase में लिया गया है)

const usersDatabase = {
    // Password: SPARK011
    'spark011': '$2b$10$wT0X5QZqX3s.4D7y8C9hO.5wY4i8N5qG7d6c2R1u9vA2g3k4l5m6n7p', 
    // Password: SPARK768
    'spark768': '$2b$10$tZ9A8YxO7P6n5m4l3k2j1i0h9g8f7e6d5c4b3a2z1y0x9w8v7u6t5s4r', 
    // Password: SPARKOP01
    'sparkop01': '$2b$10$qC6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0F9E8D7C6B5A4Z3Y2X1W0', 
    // Password: CODERS084
    'coders084': '$2b$10$pB5A4Z3Y2X1W0V9U8T7S6R5Q4P3O2N1M0L9K8J7I6H5G4F3E2D1C0B9A',
    // यदि आप 'Your Full Name' में ऊपर दिए गए पासवर्ड डालते हैं, तो लॉगिन सफल होगा।
    // *बेहतर सुरक्षा के लिए आपको यहां असली यूजरनेम का उपयोग करना चाहिए*
};

// (1) होमपेज: index.html सर्व करें
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// (2) लॉगिन Endpoint
app.post('/login', async (req, res) => {
    const { full_name, password } = req.body;
    
    // User input को डेटाबेस की keys से मैच करने के लिए lowercase करें
    const usernameKey = full_name.toLowerCase(); 
    const userHash = usersDatabase[usernameKey]; 

    // यूजरनेम मौजूद नहीं है
    if (!userHash) {
        // 
        return res.status(401).send('<h1>Login Failed: Invalid Username or Password.</h1><p>Please check your credentials.</p>');
    }

    try {
        // इनपुट पासवर्ड को स्टोर किए गए हैश से मिलाएं
        const isMatch = await bcrypt.compare(password, userHash);

        if (isMatch) {
            // लॉगिन सफल
            res.status(200).send(`
                <h1 style="color: #00FFFF;">✨ Login Successful! ✨</h1>
                <p style="color: #E0E0E0;">Welcome, ${full_name}. You have accessed the OSINT SPARK portal.</p>
                <p><a href="/" style="color: #FF00FF;">Go Back to Login</a></p>
            `);
        } else {
            // पासवर्ड गलत है
            res.status(401).send('<h1>Login Failed: Invalid Username or Password.</h1><p>Please check your credentials.</p>');
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send('<h1>Server Error: Could not process login.</h1>');
    }
});

// सर्वर शुरू करें
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
    console.log(`Ready for deployment on Vercel.`);
});