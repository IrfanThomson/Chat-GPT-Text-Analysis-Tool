import React from 'react';

const AnalysisOptions = ({ option, setOption }) => {
  return (
    <div>
      <select value={option} onChange={(e) => setOption(e.target.value)}>
        <option value="">Select analysis type...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        {/* Add more options here */}
      </select>
      {/* Add additional parameters based on the selected option */}
      <button>Start Analysis</button>
    </div>
  );
};

export default AnalysisOptions;