import React, { useState, useEffect, useContext } from 'react';
import ThemeSelector from './components/ThemeSelector.jsx';
import TypeSelector from './components/TypeSelector.jsx';
import SavedPrompts from './components/SavedPrompts.jsx';
import axios from 'axios';
import './PromptExamples.css';
import { ProgressContext } from '../ProgressContext';

export const PromptBuilder = () => {
  const { progress, updateProgress } = useContext(ProgressContext);

  const [selectedThemes, setSelectedThemes] = useState(progress.promptBuilder.selectedThemes || []);
  const [selectedThemeNames, setSelectedThemeNames] = useState(progress.promptBuilder.selectedThemeNames || []);
  const [selectedTypes, setSelectedTypes] = useState(progress.promptBuilder.selectedTypes || []);
  const [filteredPrompts, setFilteredPrompts] = useState(progress.promptBuilder.filteredPrompts || []);
  const [constructedPrompt, setConstructedPrompt] = useState(progress.promptBuilder.constructedPrompt || '');
  const [searchTerm, setSearchTerm] = useState(progress.promptBuilder.searchTerm || '');
  const [error, setError] = useState(progress.promptBuilder.error || '');
  const [isModalOpen, setIsModalOpen] = useState(progress.promptBuilder.isModalOpen || false);
  const [authorName, setAuthorName] = useState(progress.promptBuilder.authorName || '');
  const [promptName, setPromptName] = useState(progress.promptBuilder.promptName || '');
  const [viewSavedPrompts, setViewSavedPrompts] = useState(progress.promptBuilder.viewSavedPrompts || false);
  const [allThemesSelected, setAllThemesSelected] = useState(false);

  useEffect(() => {
    updateProgress('promptBuilder', { selectedThemes, 
      selectedThemeNames, 
      selectedTypes, 
      filteredPrompts, 
      constructedPrompt, 
      searchTerm, 
      error, 
      isModalOpen, 
      authorName, 
      promptName, 
      viewSavedPrompts });
  }, [selectedThemes,
      selectedThemeNames,
      selectedTypes,
      filteredPrompts,
      constructedPrompt,
      searchTerm,
      error,
      isModalOpen,
      authorName,
      promptName,
      viewSavedPrompts]);
  
  const constructPrompt = () => {
    const typeCounter = {};

    const prompt = filteredPrompts
      .filter((prompt) => prompt.checked)
      .map((prompt) => {
        const typeName = prompt.type_name.toLowerCase();
        if (!typeCounter[typeName]) {
          typeCounter[typeName] = 1;
        } else {
          typeCounter[typeName]++;
        }
        const count = typeCounter[typeName] === 1 ? '' : typeCounter[typeName];
        return `#${typeName}${count}: ${prompt.text}`;
      })
      .join('\n');
    setConstructedPrompt(prompt);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(constructedPrompt)
      .then(() => alert('Промпт успешно скопирован'))
      .catch((err) => console.error('Ошибка при копировании промпта:', err));
  };

  const savePrompt = async () => {
    try {
      const response = await axios.post('http://localhost:3034/save_prompt', {
        prompt_text: constructedPrompt,
        meta_inf: {
          author: authorName,
          name: promptName,
          bot_id: 'ID_бота', // Здесь можно указать ID бота
          description: 'Описание', // Здесь можно указать описание
          source: 'Users-prompt',
        },
      });
      alert('Промпт успешно сохранен');
      setIsModalOpen(false); 
      setAuthorName(''); 
      setPromptName(''); 
    } catch (error) {
      console.error('Ошибка при сохранении промпта:', error);
      alert('Ошибка при сохранении промпта');
    }
  };

  useEffect(() => {
    constructPrompt();
  }, [filteredPrompts]);

  const applyFilters = async () => {
    if (selectedThemes.length === 0 && selectedTypes.length === 0) {
      setError('Выберите хотя бы одну тему или тип.');
      return;
    }

    setError('');

    try {
      const themesArray = selectedThemes.join(',');
      const typesArray = selectedTypes.join(',');
      let url = 'http://localhost:3034/filter_prompts?';

      if (selectedThemes.length > 0) {
        url += `themes=${themesArray}`;
      }

      if (selectedTypes.length > 0) {
        if (selectedThemes.length > 0) {
          url += '&';
        }
        url += `types=${typesArray}`;
      }

      const response = await axios.get(url);
      setFilteredPrompts(response.data.map((prompt) => ({ ...prompt, checked: false })));
    } catch (error) {
      console.error('Ошибка при фильтрации промптов:', error);
    }
  };

  const resetFilters = () => {
    setSelectedThemes([]);
    setSelectedThemeNames([]);
    setSelectedTypes([]);
    setFilteredPrompts([]);
    setError('');
    setAllThemesSelected(false);
  };

  const handleSearch = () => {
    const searchTermLC = searchTerm.toLowerCase();
    const filteredPromptsBySearch = filteredPrompts.filter((prompt) =>
      prompt.text.toLowerCase().includes(searchTermLC)
    );
    setFilteredPrompts(filteredPromptsBySearch);
  };
//Выбор всех тем
  const selectAllThemes = async () => {
    try {
      const response = await axios.get('http://localhost:3034/get_theme');
      const allThemes = response.data.map((theme) => theme.id);
      const allThemeNames = response.data.map((theme) => theme.name);
      setSelectedThemes(allThemes);
      setSelectedThemeNames(allThemeNames);
      setAllThemesSelected(true);
    } catch (error) {
      console.error('Ошибка при выборе всех тем:', error);
    }
  };
//Выюор всех типов
  const selectAllTypes = async () => {
    try {
      const response = await axios.get('http://localhost:3034/get_type');
      const allTypes = response.data.map((type) => type.id);
      setSelectedTypes(allTypes);
    } catch (error) {
      console.error('Ошибка при выборе всех типов:', error);
    }
  };

  return (
    <div className="page-container">
      {!viewSavedPrompts ? (
        <>
          <div className="sidebar">
            <div className="selected-themes-container">
              <h3>Выбранные темы:</h3>
              <div>{allThemesSelected ? 'Выбраны все темы' : selectedThemeNames.join(', ') || 'Нет выбранных тем'}</div>
            </div>
            <div className="theme-container">
              <h2>Темы</h2>
              <ThemeSelector 
                selectedThemes={selectedThemes} 
                setSelectedThemes={setSelectedThemes} 
                selectedThemeNames={selectedThemeNames}
                setSelectedThemeNames={setSelectedThemeNames}
              />
              
            </div>
            <div className="type-container">
              <h2>Типы</h2>
              <TypeSelector selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
              
            </div>
            <button onClick={applyFilters}>Применить фильтры</button>
            <button onClick={resetFilters}>Сбросить фильтры</button>
            <button onClick={selectAllThemes}>Выбрать все темы</button>
            <button onClick={selectAllTypes}>Выбрать все типы</button>
          </div>
          <div className="main-content">
            <h1>Конструктор промптов</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Введите слово для поиска"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={handleSearch}>Поиск</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {filteredPrompts.length > 0 && (
              <div className="filtered-prompts">
                <h2>Отфильтрованные промпты:</h2>
                <ul>
                  {filteredPrompts.map((prompt, index) => (
                    <li key={index}>
                      <input
                        type="checkbox"
                        checked={prompt.checked}
                        onChange={() =>
                          setFilteredPrompts((prevState) =>
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
              </div>
            )}
            <div className="constructed">
              <button onClick={copyPrompt}>Копировать промпт</button>
              <button onClick={() => setIsModalOpen(true)}>Сохранить промпт</button>
              <button onClick={() => setViewSavedPrompts(true)}>Просмотр сохранённых промптов</button>
              <textarea
                value={constructedPrompt}
                onChange={(e) => setConstructedPrompt(e.target.value)}
              />
            </div>
          </div>
        </>
      ) : (
        <SavedPrompts />
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>Сохранение промпта</h2>
            <div>
              <label htmlFor="authorName">Имя автора:</label>
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="promptName">Имя промпта:</label>
              <input
                type="text"
                id="promptName"
                value={promptName}
                onChange={(e) => setPromptName(e.target.value)}
              />
            </div>
            <button onClick={savePrompt}>Сохранить</button>
          </div>
        </div>
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

export default PromptBuilder;
