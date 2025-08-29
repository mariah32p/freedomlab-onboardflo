import React from 'react';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">OnboardFlo</h1>
            <p className="text-xl text-gray-600">Customer onboarding made simple</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;