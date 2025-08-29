import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import ProblemSolution from './components/ProblemSolution';

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <ProblemSolution />
    </div>
  );
}

export default App;