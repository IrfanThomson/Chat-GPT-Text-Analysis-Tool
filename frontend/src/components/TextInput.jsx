import React, {useState} from 'react';

const TextInput = ({text, setText}) => {
  const [words, setWords] = useState(0)

  function handleTextInputChange(event) {
    const data = event.target.value.split(" ");
    setWords(data.length)
    if(data.length > 1000){
      alert("Warning: Exceeding 1000 words may affect performance")
    }
    setText(event.target.value);
  }

  return (
    <div className='TextInput'>
      <textarea
        rows="20"
        cols="50"
        value={text}
        onChange={handleTextInputChange}
        placeholder="Enter your text here..."
      />
      <p className='wc'>Word count: {words}/1000</p>
    </div>
  );
};

export default TextInput;