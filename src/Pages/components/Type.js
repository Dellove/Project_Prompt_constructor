import React, { useState, useEffect } from 'react';
import "./Type.css"

export default function TypeWriter({ text, speed }) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true); // Состояние для отображения/скрытия курсора
  
    useEffect(() => {
      const timer = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayText(prevText => prevText + text[currentIndex]);
          setCurrentIndex(prevIndex => prevIndex + 1);
        }
      }, speed);
  
      return () => clearTimeout(timer);
    }, [currentIndex, text, speed]);
  
    // Эффект для мигания курсора
    useEffect(() => {
      const cursorTimer = setInterval(() => {
        setShowCursor(prevShowCursor => !prevShowCursor);
      }, 500); // Мигание каждые 500 миллисекунд
  
      return () => clearInterval(cursorTimer);
    }, []);
  
    return (
      <div className="typewriter-container">
        <div className="typewriter-text">{displayText}</div>
        {showCursor && <span className="typewriter-cursor">|</span>} {/* Отображение курсора */}
      </div>
    );
  }