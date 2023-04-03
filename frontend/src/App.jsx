import React, { useState } from 'react';
import './styles.css';

function App() {
  const [textInput, setTextInput] = useState('');
  const [analysisOption, setAnalysisOption] = useState('');
  const [iterations, setIterations] = useState(1);
  const [reflectionGuidance, setReflectionGuidance] = useState('');
  const [outputText, setOutputText] = useState('');

  async function analyzeText(text, option, iterations, reflectionGuidance) {
    try {
      const response = await fetch('http://localhost:3001/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, option, iterations, reflectionGuidance }),
      });

      if (!response.ok) {
        throw new Error('An error occurred while processing the request.');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error in analyzeText:', error.message);
      throw new Error('An error occurred while processing the request.');
    }
  }

  function handleTextInputChange(event) {
    setTextInput(event.target.value);
  }

  function handleAnalysisOptionChange(event) {
    setAnalysisOption(event.target.value);
  }
  function handleIterationsChange(event) {
    setIterations(event.target.value);
  }

  function handleReflectionGuidanceChange(event) {
    setReflectionGuidance(event.target.value);
  }

  async function handleAnalyzeButtonClick() {
    if (!textInput || !analysisOption) {
      alert('Please enter text and select an analysis option.');
      return;
    }

    try {
      const result = await analyzeText(textInput, analysisOption, iterations, reflectionGuidance);
      setOutputText(result.result);
    } catch (error) {
      console.error('Error in handleAnalyzeButtonClick:', error.message);
    }
  }

  return (
    <div className="App">
      <h1>Text Analysis with ChatGPT</h1>
      <div className="TextInput">
        <textarea
          rows="20"
          cols="50"
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="Enter your text here"
        />
      </div>
      <div className="AnalysisOptions">
        <label>
          Choose analysis type:
          <select value={analysisOption} onChange={handleAnalysisOptionChange}>
            <option value="">--Select an option--</option>
            <option value="generate article">Generate Article</option>
            <option value="critical analysis">Critical Analysis</option>
          </select>
        </label>
        <label>
          Number of iterations:
          <input
            type="number"
            min="0"
            max="5"
            value={iterations}
            onChange={handleIterationsChange}
          />
        </label>
        <label>
          Reflection guidance:
          <input
            type="text"
            value={reflectionGuidance}
            onChange={handleReflectionGuidanceChange}
            placeholder="e.g., Focus on clarity"
          />
        </label>
      </div>
      <div className="AnalyzeButton">
        <button onClick={handleAnalyzeButtonClick}>Analyze</button>
      </div>
      <div className="Output">
        <textarea
          rows="20"
          cols="50"
          value={outputText}
          readOnly
          placeholder="Output will appear here"
        />
      </div>
    </div>
  );
}

export default App;