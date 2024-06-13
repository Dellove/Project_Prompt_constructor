import React from 'react';

const PromptList = ({ filteredPrompts, setFilteredPrompts, searchTerm, handleSearch }) => {
  return (
    <div className="prompt-list-container">
      <h2>Отфильтрованные промпты</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Введите слово для поиска"
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      {filteredPrompts.length > 0 && (
        <ul>
          {filteredPrompts.map((prompt, index) => (
            <li key={index}>
              <input
                type="checkbox"
                checked={prompt.checked}
                onChange={() =>
                  setFilteredPrompts(prevState =>
                    prevState.map((item, idx) =>
                      idx === index ? { ...item, checked: !item.checked } : item
                    )
                  )
                }
              />
              <strong>{prompt.type_name}: </strong>
              {highlightSearchTerm(prompt.text, searchTerm)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.split(regex).map((part, index) =>
    regex.test(part) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
  );
};

export default PromptList;
