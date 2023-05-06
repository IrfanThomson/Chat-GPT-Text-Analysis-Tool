import React, { useState } from 'react';
import './styles.css';

function App() {
  const [textInput, setTextInput] = useState('');
  const [processOption, setProcessOption] = useState('');
  const [iterations, setIterations] = useState(1);
  const [guidance, setGuidance] = useState('');
  const [selfReflectionOption, setSelfReflectionOption] = useState('default');
  const [outputText, setOutputText] = useState('');

  async function processText(text, option, iterations, guidance, selfReflectionOption) {
    try {
      const response = await fetch('http://writingdatabase.me/textapi/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, option, iterations, guidance, selfReflectionOption }),
      });

      if (!response.ok) {
        throw new Error('An error occurred while processing the request.');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error in processText:', error.message);
      throw new Error('An error occurred while processing the request.');
    }
  }

  function handleTextInputChange(event) {
    setTextInput(event.target.value);
  }

  function handleProcessOptionChange(event) {
    setProcessOption(event.target.value);
  }
  function handleIterationsChange(event) {
    setIterations(event.target.value);
  }

  function handleGuidanceChange(event) {
    setGuidance(event.target.value);
  }
  function handleSelfReflectionOptionChange(event) {
    setSelfReflectionOption(event.target.value);
  }

  async function handleProcessButtonClick() {
    if (!textInput || !processOption) {
      alert('Please enter text and select a process option.');
      return;
    }
  
    try {
      const result = await processText(textInput, processOption, iterations, guidance, selfReflectionOption);
      setOutputText(result.result);
    } catch (error) {
      console.error('Error in handleProcessButtonClick:', error.message);
    }
  }
  async function printPrompts(text, option, iterations, guidance, selfReflectionOption) {
    try {
      const response = await fetch('http://localhost:3001/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, option, iterations, guidance, selfReflectionOption }),
      });

      if (!response.ok) {
        throw new Error('An error occurred while processing the request.');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error in printPrompts:', error.message);
      throw new Error('An error occurred while processing the request.');
    }
  }

  async function handlePrintPromptsButtonClick() {
    if (!textInput || !processOption) {
      alert('Please enter text and select an process option.');
      return;
    }

    try {
      const result = await printPrompts(textInput, processOption, iterations, guidance, selfReflectionOption);
      setOutputText(result.result);
    } catch (error) {
      console.error('Error in handlePrintPromptsButtonClick:', error.message);
    }
  }
  return (
    <div className="App">
      <h1>Text Processing with ChatGPT</h1>
      <div className="TextInput">
        <textarea
          rows="20"
          cols="50"
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="Enter your text here"
        />
      </div>
      <div className="ProcessOptions">
        <label>
          Choose process:
          <select value={processOption} onChange={handleProcessOptionChange}>
            <option value="">--Select an option--</option>
            <option value="generate article">Generate Article</option>
            <option value="generate story">Generation Story</option>
            <option value="critical analysis">Critical Analysis</option>
            <option value="idea analysis">Idea Analysis</option>
          </select>
        </label>
        <label>
          Self-reflection option:
          <select value={selfReflectionOption} onChange={handleSelfReflectionOptionChange}>
            <option value="default">Default</option>
            <option value="critical analysis">Critical Analysis</option>
            <option value="idea analysis">Idea Analysis</option>
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
          Manual guidance:
          <input
            type="text"
            value={guidance}
            onChange={handleGuidanceChange}
            placeholder="e.g., Focus on clarity"
          />
        </label>
      </div>
      <div className="Buttons">
        <button onClick={handleProcessButtonClick}>Process</button>
        <button onClick={handlePrintPromptsButtonClick}>Print Prompts</button>
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