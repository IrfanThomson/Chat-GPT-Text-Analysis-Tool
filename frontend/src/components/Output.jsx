import React from 'react';

const Output = ({ output }) => {
  return (
    <div className='Output'>
      <textarea
        rows="20"
        cols="50"
        value={output}
        readOnly
        placeholder="Output will appear here..."
      />
    </div>
  );
};

export default Output;