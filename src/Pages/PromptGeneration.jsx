import React, { useState, useEffect, useContext } from 'react';
import './PromptGeneration.css';
import { ProgressContext } from '../ProgressContext';

export const PromptGeneration = () => {
  const { progress, updateProgress } = useContext(ProgressContext);
  
  const [text, setText] = useState(progress.promptGeneration.text || '');
  const [results, setResults] = useState(progress.promptGeneration.results || '');
  const [error, setError] = useState(progress.promptGeneration.error || null);
  const [loading, setLoading] = useState(progress.promptGeneration.loading || false);

  useEffect(() => {
    updateProgress('promptGeneration', { text, results, error });
  }, [text, results, error]);
  

  const generatePrompt = async () => {
    setLoading(true);
    setError(null);
    setResults('');

    try {
      console.log('Запрос на генерацию:', text);
      const response = await fetch('http://localhost:3034/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      const data = await response.json(); 
      const results = JSON.parse(data.results); 
      console.log('Сгенерированный ответ:', results);

      setResults(results);
    } catch (error) {
      console.error('Error:', error);
      setError('Ошибка генерации промпта');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results)
      .then(() => alert('Промпт успешно скопирован'))
      .catch(err => console.error('Ошибка при копировании промпта:', err));
  };

  return (
    <div className="container">
      <h2>Промпт-генератор</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10"
        cols="50"
      />
      <button onClick={generatePrompt} disabled={loading}>Сгенерировать промпт</button>
      {loading && <div className="loader"></div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {results && (
        <div className="generated-prompt">
          <h2>Сгенерированный промпт:</h2>
          <textarea
            value={results}
            onChange={(e) => setResults(e.target.value)} 
            rows="10"
            cols="50"
          />
          <button onClick={copyToClipboard}>Скопировать промпт</button>
        </div>
      )}
    </div>
  );
};

export default PromptGeneration;
