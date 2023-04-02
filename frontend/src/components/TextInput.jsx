import React from 'react';

const TextInput = ({ text, setText }) => {
  return (
    <div>
      <textarea
        rows="20"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
      />
    </div>
  );
};

export default TextInput;