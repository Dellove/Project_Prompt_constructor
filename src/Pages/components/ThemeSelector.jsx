import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ThemeSelector = ({ selectedThemes, setSelectedThemes, selectedThemeNames, setSelectedThemeNames }) => {
    const [themes, setThemes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3034/get_theme')
            .then(response => setThemes(response.data))
            .catch(error => console.error('Error fetching themes:', error));
    }, []);

    const handleCheckboxChange = (theme) => {
        const { id, name_theme } = theme;
        const updatedSelectedThemes = selectedThemes.includes(id)
            ? selectedThemes.filter(tid => tid !== id)
            : [...selectedThemes, id];
        
        const updatedSelectedThemeNames = selectedThemes.includes(id)
            ? selectedThemeNames.filter(tname => tname !== name_theme)
            : [...selectedThemeNames, name_theme];
        
        setSelectedThemes(updatedSelectedThemes);
        setSelectedThemeNames(updatedSelectedThemeNames);
    };

    const filteredThemes = themes.filter(theme =>
        theme.name_theme.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="theme-selector">
            <input
                type="text"
                placeholder="Поиск тем"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            {filteredThemes.map(theme => (
                <label key={theme.id}>
                    <input
                        type="checkbox"
                        checked={selectedThemes.includes(theme.id)}
                        onChange={() => handleCheckboxChange(theme)}
                    />
                    {theme.name_theme}
                </label>
            ))}
        </div>
    );
};

export default ThemeSelector;
