import React, { createContext, useState } from 'react';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({
    promptBuilder: {
      selectedThemes: [],
      selectedThemeNames: [],
      selectedTypes: [],
      filteredPrompts: [],
      constructedPrompt: '',
      searchTerm: '',
      error: '',
      isModalOpen: false,
      authorName: '',
      promptName: '',
      viewSavedPrompts: false,
    },
    promptGeneration: {
      text: '',
      results: '',
      error: null,
      loading: false,
    },
  });

  const updateProgress = (component, data) => {
    setProgress((prev) => ({
      ...prev,
      [component]: {
        ...prev[component],
        ...data,
      },
    }));
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
