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
    const { text, option, iterations = 0, reflectionGuidance } = req.body;

    if (!text || !option) {
      res.status(400).json({ success: false, message: 'Missing text or analysis option.' });
      return;
    }

    const maxIterations = 5;
    const effectiveIterations = Math.min(iterations, maxIterations);

    let analysisResult = await analyzeTextWithChatGPT(text, option);

    for (let i = 0; i < effectiveIterations; i++) {
      analysisResult = await selfReflectOnAnalysis(text, option, analysisResult.result, reflectionGuidance);
    }

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

async function selfReflectOnAnalysis(originalText, option, initialResponse, reflectionGuidance = '') {
  const prompt = `Refine the analysis of the original text:\n\n"${originalText}"\n\nOption: ${option}\n\nImprove the previous response:\n\n"${initialResponse}"\n\nConsider any flaws or inaccuracies without stating them explicitly and directly provide a higher-quality answer. ${reflectionGuidance}`;

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  const revisedResponse = processChatGptResponse(response.data.choices[0].message.content);
  return { success: true, result: revisedResponse };
}

function generatePrompt(text, option) {
  let prompt = '';

  switch (option) {
    case 'generate article':
      prompt = `Using the following text as a starting point, create a detailed and engaging article that weaves these ideas together, explores their connections, and dives deeper into the subject matter:\n\n${text}`;
      break;
    case 'critical analysis':
      prompt = `Please perform a comprehensive and critical evaluation of the following text and identify its strengths and weaknesses in detail. Provide specific improvements and actionable suggestions, supported by examples:\n\n${text}`;
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