// src/components/Prompt.js
import React from 'react';

const Prompt = ({ prompt }) => {
  return (
    <div>
      <h2>Сгенерированный промпт:</h2>
      <p>{prompt}</p>
    </div>
  );
};

export default Prompt;
