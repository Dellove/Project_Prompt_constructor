import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Select.css';

const PromptSelector = ({ themeId, type, onSelect }) => {
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
//Выбор типов
    useEffect(() => {
        let url;
        switch (type) {
            case 'character':
                url = `http://localhost:3034/prompts/${themeId}/characters`;
                break;
            case 'skill':
                url = `http://localhost:3034/prompts/${themeId}/skills`;
                break;
            case 'constraint':
                url = `http://localhost:3034/prompts/${themeId}/constraints`;
                break;
            case 'presentation':
                url = `http://localhost:3034/prompts/${themeId}/presentations`;
                break;
            case 'controller':
                url = `http://localhost:3034/prompts/${themeId}/controllers`;
                break;
            default:
                console.error('Invalid type');
                return;
        }

        axios.get(url)
            .then(response => setOptions(response.data))
            .catch(error => console.error(`Error fetching ${type}s:`, error));
    }, [themeId, type]);

    const handleCheckboxChange = (option) => {
        setSelectedOptions(prevSelectedOptions => {
            const isSelected = prevSelectedOptions.includes(option);
            const newSelectedOptions = isSelected
                ? prevSelectedOptions.filter(item => item !== option)
                : [...prevSelectedOptions, option];
            
            onSelect(newSelectedOptions);
            return newSelectedOptions;
        });
    };

    return (
        <div>
            {options.map(option => (
                <div key={option}>
                    <label>
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedOptions.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                        />
                        {option}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default PromptSelector;
