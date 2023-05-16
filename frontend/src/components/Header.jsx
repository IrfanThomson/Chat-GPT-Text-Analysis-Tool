import React from 'react';

const Header = () => {
  return (
    <div className='Header'>
      <h1>Text Processing with ChatGPT</h1>
      <h3>Instructions:</h3>
      <p>Enter text in top area, choose text processing method, and a self reflection option
        <br></br> to have the AI process the text and automatically improve its response before returning it. The
        <br></br> "manual guidance" is added to the end of any chosen processing method, and it can also be used
        <br></br>  with the "blank" process option for an entirely user-generated prompt. Hit "Process" to generate 
        <br></br> a response or "Print Prompts" to see what the website would have entered into Chat GPT if you had
        <br></br> hit process.</p>
    </div>
  );
};

export default Header;