import React, { useState } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';

const DrugSearchForm = ({ onSearch, onReset, loading }) => {
  const [formData, setFormData] = useState({
    drugName: '',
    zipCode: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.drugName.trim()) {
      newErrors.drugName = 'Drug name is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSearch(formData);
    }
  };

  const handleReset = () => {
    setFormData({ drugName: '', zipCode: '' });
    setErrors({});
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drug Name Input */}
        <div>
          <label htmlFor="drugName" className="block text-sm font-medium text-gray-700 mb-2">
            Drug Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="drugName"
              name="drugName"
              value={formData.drugName}
              onChange={handleInputChange}
              placeholder="e.g., Lipitor, Metformin, Lisinopril"
              className={`input-field pl-10 ${errors.drugName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.drugName && (
            <p className="mt-1 text-sm text-red-600">{errors.drugName}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter brand name or generic name
          </p>
        </div>

        {/* ZIP Code Input */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="12345"
              maxLength="5"
              className={`input-field pl-10 ${errors.zipCode ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter your 5-digit ZIP code
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center justify-center space-x-2 flex-1 sm:flex-none sm:w-auto"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search Prices</span>
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="btn-secondary flex items-center justify-center space-x-2 flex-1 sm:flex-none sm:w-auto"
        >
          <span>Clear Search</span>
        </button>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Search Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• You can search by brand name (e.g., "Lipitor") or generic name (e.g., "Atorvastatin")</li>
          <li>• Results will show pricing across different Medicare plans and pharmacy types</li>
          <li>• Generic alternatives with estimated savings will be suggested when available</li>
        </ul>
      </div>
    </form>
  );
};

export default DrugSearchForm;