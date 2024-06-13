import './components/Header.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './Home';
import { PromptGeneration } from './PromptGeneration';
import { PromptBuilder } from './PromptExamples';
import { Instruction } from './Instruction';
import { Analyse } from './Analyse';
import { ProgressProvider } from '../ProgressContext';

export default function Header() {
    return (
        <ProgressProvider>
            <Router>
                <header>
                    <nav className="navbar">
                        <ul>
                            <li><Link to="/">Главная</Link></li>
                            <li><Link to="/PromptGeneration">Генерация промпта</Link></li>
                            <li><Link to="/PromptBuilder">Конструктор промптов</Link></li>
                            <li><Link to="/Instruction">Инструкция</Link></li>
                            <li><Link to="/Analyse">Анализ</Link></li>
                        </ul>
                    </nav>
                </header>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/PromptGeneration" element={<PromptGeneration />} />
                    <Route path="/PromptBuilder" element={<PromptBuilder />} />
                    <Route path="/Instruction" element={<Instruction />} />
                    <Route path="/Analyse" element={<Analyse />} />
                </Routes>
            </Router>
        </ProgressProvider>
    );
}
