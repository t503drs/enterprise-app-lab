import React from 'react';
import { Package, TrendingDown, CheckCircle, Info } from 'lucide-react';

const GenericAlternatives = ({ alternatives }) => {
  if (!alternatives || alternatives.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-warning-100 rounded-lg">
            <Package className="w-5 h-5 text-warning-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Generic Alternatives</h2>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-600" />
            <p className="text-blue-800 font-medium">No generic alternatives found</p>
          </div>
          <p className="text-blue-700 mt-1 text-sm">
            This may be because the drug is already a generic, or no alternatives are available in the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-success-100 rounded-lg">
          <Package className="w-5 h-5 text-success-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Generic Alternatives</h2>
          <p className="text-gray-600">Lower-cost options that may be available</p>
        </div>
      </div>

      <div className="space-y-4">
        {alternatives.map((alternative, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success-600" />
                  <h3 className="text-lg font-medium text-gray-900">{alternative.name}</h3>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="w-4 h-4 text-success-600" />
                    <span>Estimated {alternative.estimated_savings}% savings</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{alternative.availability}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-success-600">
                  Save {alternative.estimated_savings}%
                </div>
                <div className="text-sm text-gray-500">Potential savings</div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button 
                className="btn-primary text-sm"
                onClick={() => {
                  // In a real application, this would trigger a new search for the alternative
                  console.log(`Searching for pricing of: ${alternative.name}`);
                }}
              >
                Check Pricing for {alternative.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900 mb-1">Important Information</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Generic alternatives are suggested based on available data and may not be comprehensive</li>
              <li>• Savings estimates are approximate and may vary based on your specific plan</li>
              <li>• Always consult with your doctor before switching medications</li>
              <li>• Availability may vary by pharmacy and location</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericAlternatives;