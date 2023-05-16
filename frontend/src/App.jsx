import React, { useState } from 'react';
import './styles.css';
import Header from './components/Header';
import TextInput from './components/TextInput';
import Output from './components/Output';
import AnalysisOptions from './components/AnalysisOptions';
import ButtonLoader from './components/ButtonLoader';

function App() {
  const [textInput, setTextInput] = useState('');
  const [processOption, setProcessOption] = useState('');
  const [iterations, setIterations] = useState(0);
  const [guidance, setGuidance] = useState('');
  const [selfReflectionOption, setSelfReflectionOption] = useState('default');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false)

  async function processText(text, option, iterations, guidance, selfReflectionOption) {
    try {
      const response = await fetch('https://textprocess.irfanthomson.com/api/process-text', {
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
      const response = await fetch('https://textprocess.irfanthomson.com/api/generate-prompt', {
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
    setLoading(true)
    if (!textInput || !processOption) {
      alert('Please enter text and select an process option.');
      return;
    }

    try {
      const result = await printPrompts(textInput, processOption, iterations, guidance, selfReflectionOption);
      setOutputText(result.result);
    } catch (error) {
      console.error('Error in handlePrintPromptsButtonClick:', error.message);
      alert("There was an error in handling the request");
    }
    setLoading(false)
  }
  return (
    <div className="App">
      <Header></Header>
      <TextInput text={textInput} setText={setTextInput}></TextInput>
      <AnalysisOptions option={processOption} setOption={setProcessOption}
      selfReflection={selfReflectionOption} setSelfReflection={setSelfReflectionOption}
      iterations={iterations} setIterations={setIterations}
      guidance={guidance} setGuidance={setGuidance}
      ></AnalysisOptions>
      <div className="Buttons">
        <ButtonLoader process={handleProcessButtonClick}></ButtonLoader>
        <button onClick={handleProcessButtonClick} disabled={loading}>
        {loading && (
            <i
              className="fa fa-refresh fa-spin"
              style={{ marginRight: "5px" }}
            />
          )}
          {loading && <span>Loading</span>}
          {!loading && <span>Process</span>}
          </button>
        <button onClick={handlePrintPromptsButtonClick}>Print Prompts</button>
      </div>
      <Output output={outputText}></Output>
    </div>
  );
}

export default App;