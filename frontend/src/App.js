import React, { useState } from 'react';
import DrugPricingWidget from './components/DrugPricingWidget';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Drug Pricing Transparency Tool
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compare drug prices across Medicare plans and pharmacies. 
              Find the most cost-effective options for your prescriptions.
            </p>
          </div>
          
          <DrugPricingWidget />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;