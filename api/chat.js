const https = require('https');

module.exports = async (req, res) => {
    // 1. Set CORS Headers to allow proper requests
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: { message: 'Method not allowed' } });
        return;
    }

    // 3. Read API key from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.status(500).json({
            error: {
                message: 'Gemini API Key is not configured in Vercel Environment Variables.'
            }
        });
        return;
    }

    try {
        const { contents, systemInstruction } = req.body;

        if (!contents || !Array.isArray(contents)) {
            res.status(400).json({ error: { message: 'Invalid or missing contents payload.' } });
            return;
        }

        // Construct payload for Gemini API
        const payloadData = {
            contents,
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.2
            }
        };

        // Add systemInstruction if present
        if (systemInstruction) {
            payloadData.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const payload = JSON.stringify(payloadData);

        // Make HTTP request to Google Gemini API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const responseData = await postRequest(url, payload);
        
        // Forward response back to the client browser
        res.status(200).json(responseData);

    } catch (error) {
        res.status(500).json({ error: { message: error.message || 'Internal Server Error' } });
    }
};

// Helper function to make HTTP POST requests using native 'https' module
function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(parsed.error?.message || `HTTP Error ${res.statusCode}`));
                    }
                } catch (e) {
                    reject(new Error('Failed to parse response JSON'));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(data);
        req.end();
    });
}
