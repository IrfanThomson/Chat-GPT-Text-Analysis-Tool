const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Text analysis API');
});

app.post("/api/analyze-text", async (req, res) => {
    try {
      const { text, option } = req.body;
  
      if (!text || !option) {
        res.status(400).json({ success: false, message: "Missing text or analysis option." });
        return;
      }
  
      const analysisResult = await analyzeTextWithChatGPT(text, option);
      res.status(200).json(analysisResult);
    } catch (error) {
      console.error("Error in /api/analyze-text:", error.message);
      res.status(500).json({ success: false, message: "An error occurred while processing the request." });
    }
});

async function analyzeTextWithChatGPT(text, option) {
    const apiKey = process.env.CHATGPT_API_KEY;
    const apiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";
  
    const prompt = generatePrompt(text, option);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
  
    const data = {
      prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5,
    };
  
    try {
      const response = await axios.post(apiUrl, data, { headers });
      const analysisResult = processChatGptResponse(response.data.choices[0].text);
  
      return { success: true, result: analysisResult };
    } catch (error) {
      console.error("Error in analyzeTextWithChatGPT:", error.message);
      console.error("Error details:", error);
      throw new Error("An error occurred while processing the request.");
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  async function analyzeTextWithChatGPT(text, option) {
    const apiKey = process.env.CHATGPT_API_KEY;
    const apiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";
  
    const prompt = generatePrompt(text, option);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
  
    const data = {
      prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5,
    };
  
    try {
      const response = await axios.post(apiUrl, data, { headers });
      const analysisResult = processChatGptResponse(response.data.choices[0].text);
  
      return { success: true, result: analysisResult };
    } catch (error) {
      console.error("Error in analyzeTextWithChatGPT:", error.message);
      throw new Error("An error occurred while processing the request.");
    }
  }
  
  function generatePrompt(text, option) {
    let prompt = "";

    switch (option) {
        case "summarize":
        prompt = `Please summarize the following text:\n\n${text}\n\nSummary: `;
        break;
        case "grammar_check":
        prompt = `Please check the grammar of the following text and suggest corrections:\n\n${text}\n\nCorrected Text: `;
        break;
        default:
        throw new Error("Invalid analysis option.");
    }
    return prompt;
  }

  
  function processChatGptResponse(responseText) {
    if (!responseText) {
        throw new Error("Invalid response text.");
      }
    
      // Remove the initial label (e.g., "Summary: " or "Corrected Text: ")
      const result = responseText.replace(/^(Summary|Corrected Text): /, "").trim();
      return result;
  }