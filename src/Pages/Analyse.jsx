import React, { useState, useContext, useEffect } from 'react';
import { ProgressContext } from '../ProgressContext';
import './PromptGeneration.css';

export const Analyse = () => {
  const { progress, updateProgress } = useContext(ProgressContext);

  // Проверяем, определен ли progress.analyse
  const initialText = progress.analyse ? progress.analyse.text : '';
  const initialResults = progress.analyse ? progress.analyse.results : null;
  const initialError = progress.analyse ? progress.analyse.error : null;

  const [text, setText] = useState(initialText);
  const [results, setResults] = useState(initialResults);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateProgress('analyse', { text, results, error });
  }, [text, results, error]);
  

  const analyzeText = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('Запрос на обработку:', text);
      const response = await fetch('http://localhost:3034/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      const data = await response.json(); // Парсим ответ сервера
      const results = JSON.parse(data.results); // Парсим строку json в объект javascript
      console.log('Received response:', results);

      setResults(results);
    } catch (error) {
      console.error('Error:', error);
      setError('Не получилось проанализировать');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Анализ промпта</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="10"
        cols="50"
      />
      <button onClick={analyzeText} disabled={loading}>Проанализировать</button>
      {loading && <div className="loader"></div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {results && (
        <div>
          <h2>Результаты анализа:</h2>
          <ul>
            <li>Number of Words: {results.num_words}</li>
            <li>Number of Characters: {results.num_chars}</li>
            <li>Average Sentence Length: {results.avg_sentence_length}</li>
            <li>Lexical Diversity: {results.lexical_diversity}</li>
            <li>Grammar Errors: {results.grammar_errors}</li>
            {results.sentiment_score && results.sentiment_score.length >= 2 && (
              <li>Sentiment Score: {results.sentiment_score[0]} ({results.sentiment_score[1]})</li>
            )}
            {results.error_words && Array.isArray(results.error_words) && (
              <li>Error Words: {results.error_words.join(', ')}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
