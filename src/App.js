import React from 'react';
import Header from './Pages/Header.jsx';
import { ProgressProvider } from './ProgressContext.js';


export default function App() {
  return (
    <ProgressProvider>
      <div>
        <Header />
      </div>
    </ProgressProvider>
  );
}

