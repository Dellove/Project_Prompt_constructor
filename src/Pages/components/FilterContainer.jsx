import React from 'react';
import TypeSelector from './TypeSelector.jsx';
import ThemeFilterContainer from './ThemeFilterContainer';

const FilterContainer = ({
  selectedThemes,
  setSelectedThemes,
  selectedTypes,
  setSelectedTypes,
  applyFilters,
  applyThemeFilter,
  applyTypeFilter
}) => {
  return (
    <div className="filter-container">
      <h2>Фильтры</h2>
      <ThemeFilterContainer
        selectedThemes={selectedThemes}
        setSelectedThemes={setSelectedThemes}
        applyThemeFilter={applyThemeFilter}
      />
      <div className="type-filter-container">
        <h3>Фильтр по типам</h3>
        <TypeSelector selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
        <button onClick={applyTypeFilter}>Фильтровать по типам</button>
      </div>
      <button onClick={applyFilters}>Применить фильтры</button>
    </div>
  );
};

export default FilterContainer;
