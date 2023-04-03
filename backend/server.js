const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Text analysis API');
});

app.post('/api/analyze-text', async (req, res) => {
  try {
    const { text, option } = req.body;

    if (!text || !option) {
      res.status(400).json({ success: false, message: 'Missing text or analysis option.' });
      return;
    }

    const analysisResult = await analyzeTextWithChatGPT(text, option);
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Error in /api/analyze-text:', error.message);
    res.status(500).json({ success: false, message: 'An error occurred while processing the request.' });
  }
});

async function analyzeTextWithChatGPT(text, option) {
  const prompt = generatePrompt(text, option);

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  const analysisResult = processChatGptResponse(response.data.choices[0].message.content);
  return { success: true, result: analysisResult };
}

function generatePrompt(text, option) {
  let prompt = '';

  switch (option) {
    case 'summarize':
      prompt = `Please summarize the following text:\n\n${text}`;
      break;
    case 'grammar_check':
      prompt = `Please check the grammar of the following text and suggest corrections:\n\n${text}`;
      break;
    default:
      throw new Error('Invalid analysis option.');
  }
  return prompt;
}

function processChatGptResponse(responseText) {
  if (!responseText) {
    throw new Error('Invalid response text.');
  }

  return responseText.trim();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});