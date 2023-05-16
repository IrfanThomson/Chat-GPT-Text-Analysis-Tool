import React from 'react';

const AnalysisOptions = ({ option, setOption, selfReflection, setSelfReflection, iterations, setIterations, guidance, setGuidance }) => {
  function handleProcessOptionChange(event) {
    setOption(event.target.value);
  }
  function handleIterationsChange(event) {
    setIterations(event.target.value);
  }
  function handleGuidanceChange(event) {
    setGuidance(event.target.value);
  }
  function handleSelfReflectionOptionChange(event) {
    setSelfReflection(event.target.value);
  }
  
  return (
    <div className='AnalysisOptions'>
        <label>
          Choose process:
          <select value={option} onChange={handleProcessOptionChange}>
            <option value="blank">Blank</option>
            <option value="generate article">Generate Article</option>
            <option value="generate story">Generate Story</option>
            <option value="critical analysis">Critical Analysis</option>
            <option value="idea analysis">Idea Analysis</option>
          </select>
        </label>
        <label>
          Self-reflection option:
          <select value={selfReflection} onChange={handleSelfReflectionOptionChange}>
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
  );
};

export default AnalysisOptions;