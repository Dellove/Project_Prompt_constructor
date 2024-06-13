import React from 'react';
import ThemeSelector from './ThemeSelector.jsx';

const ThemeFilterContainer = ({ selectedThemes, setSelectedThemes, applyThemeFilter }) => {
  return (
    <div className="theme-filter-container">
      <h3>Фильтр по темам</h3>
      <ThemeSelector selectedThemes={selectedThemes} setSelectedThemes={setSelectedThemes} />
      <button onClick={applyThemeFilter}>Фильтровать по темам</button>
    </div>
  );
};

export default ThemeFilterContainer;
