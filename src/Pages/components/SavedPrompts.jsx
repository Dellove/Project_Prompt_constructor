import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SavedPrompts.css';

const SavedPrompts = () => {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const fetchSavedPrompts = async () => {
      try {
        const response = await axios.get('http://localhost:3034/get_saved_prompts');
        setPrompts(response.data);
      } catch (error) {
        console.error('Ошибка при получении сохранённых промптов:', error);
      }
    };

    fetchSavedPrompts();
  }, []);

  const handleReturnClick = () => {
    window.location.reload(); // Обновляем страницу для возврата к конструктору
  };

  return (
    <div className="saved-prompts-container">
      <h2>Сохранённые Промпты</h2>
      <button onClick={handleReturnClick}>Вернуться к конструктору</button>
      {prompts.length > 0 ? (
        <ul>
          {prompts.map((prompt, index) => (
            <li key={index} className="prompt-item">
              <div><strong>Автор:</strong> {prompt.author}</div>
              <div><strong>Название:</strong> {prompt.name}</div>
              <div><strong>Промпт:</strong> <pre>{prompt.promt_text}</pre></div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет сохранённых промптов.</p>
      )}
    </div>
  );
};

export default SavedPrompts;
