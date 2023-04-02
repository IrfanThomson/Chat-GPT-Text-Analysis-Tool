import React, { useState } from 'react';
import Header from './components/Header';
import TextInput from './components/TextInput';
import AnalysisOptions from './components/AnalysisOptions';
import Output from './components/Output';
import './styles.css'

function App() {
  const [text, setText] = useState('');
  const [option, setOption] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div className="App">
      <Header />
      <TextInput text={text} setText={setText} />
      <AnalysisOptions option={option} setOption={setOption} />
      <Output output={output} />
    </div>
  );
}
export default App;
