require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { AzureOpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3001;

const openai = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT, // e.g., https://cts-vibeopenai01.openai.azure.com
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT, // e.g., cts-vibecode-gpt-4.1
    apiVersion: process.env.OPENAI_API_VERSION || '2025-01-01-preview',
});

app.use(cors());
app.use(express.json());

app.post('/api/process-text', async (req, res) => {
    const { text, history } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'No text provided.' });
    }

    const messages = [
        { 
            role: 'system', 
            content: 'You are a helpful assistant for analyzing prescription text. Your goal is to extract key information such as medication name, dosage, frequency, and any other relevant instructions. For the first message, analyze the provided prescription text. For subsequent messages, answer questions about it. Present the information in a clear, concise, and easy-to-understand format.' 
        },
        ...(history || []),
        { role: 'user', content: text }
    ];

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.AZURE_OPENAI_DEPLOYMENT,
            messages: messages,
        });

        res.json({ analysis: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error processing text with OpenAI:', error);
        res.status(500).json({ error: 'Failed to process text with AI.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 