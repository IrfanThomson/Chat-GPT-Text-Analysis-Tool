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

app.get('/api', (req, res) => {
  res.send('Text process API');
});

app.get('/api/test', (req,res) => {
  res.send('Get test success')
});

app.post('/api/test', (req,res) => {
  res.send('Post test success')
});

app.post('/api/process-text', async (req, res) => {
  try {
    const { text, option, iterations = 0, guidance, selfReflectionOption} = req.body;
    if (!text || !option) {
      res.status(400).json({ success: false, message: 'Missing text or process option.' });
      return;
    }

    const maxIterations = 5;
    const effectiveIterations = Math.min(iterations, maxIterations);

    let processResult = await processTextWithChatGPT(text, option, guidance);

    processResult = await selfReflectOnAnalysis(processResult.result, effectiveIterations, guidance, selfReflectionOption, text, option);

    res.status(200).json(processResult);
  } catch (error) {
    console.error('Error in /api/process-text:', error.message);
    res.status(500).json({ success: false, message: 'An error occurred while processing the request.' });
  }
});

app.post('/api/generate-prompt', async (req, res) => {
  try {
    const { text, option, iterations, guidance, selfReflectionOption } = req.body;

    if (!text || !option) {
      res.status(400).json({ success: false, message: 'Missing text or process option.' });
      return;
    }

    const generatedPrompt = generatePrompt(text, option, guidance);
    let prompts = [generatedPrompt];

    if (iterations && iterations > 0) {
      for (let i = 0; i < iterations; i++) {
        let reflectionPrompt;
        switch (selfReflectionOption) {
          case 'default':
            reflectionPrompt = `Refine the analysis of the original text:\n\n"${text}"\n\nOption: ${option}\n\nImprove the previous response:\n\n"${generatedPrompt}"\n\nConsider any flaws or inaccuracies without stating them explicitly and directly provide a higher-quality answer. ${guidance}`;
            prompts.push(reflectionPrompt);
            break;
          case 'critical analysis':
            reflectionPrompt = `Please perform a comprehensive and critical evaluation of the following text and identify its strengths and weaknesses in detail. Provide specific improvements and actionable suggestions, supported by examples. ${guidance}`;
            prompts.push(reflectionPrompt);
            const improvementPrompt = `Based on that critical analysis, please improve the original text. ${guidance}`;
            prompts.push(improvementPrompt);
            break;
          case 'idea analysis':
            reflectionPrompt = `Please perform a comprehensive and critical evaluation of the ideas presented in the following text. Identify the strengths and weaknesses of these ideas in detail. Provide specific improvements and actionable suggestions, supported by examples, to enhance the quality and depth of the ideas. ${guidance}`;
            prompts.push(reflectionPrompt);
            const ideaImprovementPrompt = `Based on the idea analysis provided, please improve the original text. ${guidance}`;
            prompts.push(ideaImprovementPrompt);
            break;
          default:
            throw new Error('Invalid self-reflection option.');
        }
      }
    }
    res.status(200).json({ success: true, result: prompts.join('\n\n---\n\n') });
  } catch (error) {
    console.error('Error in /api/generate-prompt:', error.message);
    res.status(500).json({ success: false, message: 'An error occurred while processing the request.' });
  }
});

async function processTextWithChatGPT(text, option, guidance) {
  const prompt = generatePrompt(text, option, guidance);

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  const processResult = processChatGptResponse(response.data.choices[0].message.content);
  return { success: true, result: processResult };
}

async function selfReflectOnAnalysis(initialResponse, numIterations, guidance, selfReflectionOption, text, option) {
  let currentResponse = initialResponse;

  for (let i = 0; i < numIterations; i++) {
    if (selfReflectionOption === 'default') {
      const defaultPrompt = `Refine the analysis of the original text:\n\n"${text}"\n\nOption: ${option}\n\nImprove the previous response:\n\n"${initialResponse}"\n\nConsider any flaws or inaccuracies without stating them explicitly and directly provide a higher-quality answer. ${guidance}`;

      const defaultResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: defaultPrompt }],
      });

      currentResponse = processChatGptResponse(defaultResponse.data.choices[0].message.content);
    } else {
      const analysisPrompt = generatePrompt(currentResponse, selfReflectionOption, guidance);

      const analysisResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: analysisPrompt }],
      });
      const analyzedResponse = processChatGptResponse(analysisResponse.data.choices[0].message.content);

      const improvementPrompt = `Based on the analysis provided, please improve the original text. ${guidance}\n\nOriginal Text: ${currentResponse}\n\nAnalysis: ${analyzedResponse}`;

      const improvedResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: improvementPrompt }],
      });

      currentResponse = processChatGptResponse(improvedResponse.data.choices[0].message.content);
    }
  }

  return { success: true, result: currentResponse };
}

function generatePrompt(text, option, guidance) {
  let prompt = '';

  switch (option) {
    case 'blank':
      prompt = `${guidance}\n\n${text}`;
      break;
    case 'generate article':
      prompt = `Using the following text as a starting point, create a detailed and engaging article that weaves these ideas together, explores their connections, and dives deeper into the subject matter. ${guidance}\n\n${text}`;
      break;
    case 'generate story':
      prompt = `Given the text below, construct a comprehensive outline for an enthralling story. Ensure that the outline covers key plot points, character development, subplots, and relevant themes. Use the provided ideas as a foundation to build a rich and engaging narrative. ${guidance}\n\n${text}`;
      break;
    case 'critical analysis':
      prompt = `Please perform a comprehensive and critical evaluation of the following text and identify its strengths and weaknesses in detail. Provide specific improvements and actionable suggestions, supported by examples. ${guidance}\n\n${text}`;
      break;
    case 'idea analysis':
      prompt = `Please perform a comprehensive and critical evaluation of the ideas presented in the following text. Identify the strengths and weaknesses of these ideas in detail. Provide specific improvements and actionable suggestions, supported by examples, to enhance the quality and depth of the ideas. ${guidance}\n\n${text}`;
      break;
    default:
      throw new Error('Invalid process option.');
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