import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TypeSelector = ({ selectedTypes, setSelectedTypes }) => {
    const [types, setTypes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3034/get_type')
            .then(response => setTypes(response.data))
            .catch(error => console.error('Error fetching types:', error));
    }, []);

    const handleCheckboxChange = (typeId) => {
        const updatedSelectedTypes = selectedTypes.includes(typeId)
            ? selectedTypes.filter(id => id !== typeId)
            : [...selectedTypes, typeId];
        
        setSelectedTypes(updatedSelectedTypes);
    };

    return (
        <div className="type-selector">
            <h2>Выберите типы промпта</h2>
            {types.map(type => (
                <label key={type.id}>
                    <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.id)}
                        onChange={() => handleCheckboxChange(type.id)}
                    />
                    {type.name_type}
                </label>
            ))}
        </div>
    );
};

export default TypeSelector;
