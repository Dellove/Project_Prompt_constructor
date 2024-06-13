import React, { useState } from 'react';
import axios from 'axios';

const TextAnalyzer = () => {
    const [text, setText] = useState('');
    const [results, setResults] = useState(null);

    const analyzeText = () => {
        axios.post('http://localhost:3034/analyze', { text })
            .then(response => {
                setResults(response.data);
            })
            .catch(error => {
                console.error('Error analyzing text:', error);
            });
    };

    return (
        <div>
            <h2>Text Analyzer</h2>
            <textarea
                rows="10"
                cols="50"
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>
            <br />
            <button onClick={analyzeText}>Analyze Text</button>
            <br />
            {results && Object.keys(results).length > 0 && (
                <div>
                    <h3>Analysis Results:</h3>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default TextAnalyzer;
