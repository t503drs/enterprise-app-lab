import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, AlertCircle, Loader, DollarSign, Package } from 'lucide-react';
import DrugSearchForm from './DrugSearchForm';
import PricingResults from './PricingResults';
import GenericAlternatives from './GenericAlternatives';

const DrugPricingWidget = () => {
  const [searchData, setSearchData] = useState({
    drugName: '',
    zipCode: ''
  });
  
  const [results, setResults] = useState({
    drugInfo: null,
    pricing: null,
    alternatives: null,
    loading: false,
    error: null
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSearch = async (formData) => {
    setResults(prev => ({ ...prev, loading: true, error: null }));
    setSearchData(formData);

    try {
      // Search for drug information
      const drugResponse = await axios.post(`${API_BASE_URL}/search-drug`, {
        drug_name: formData.drugName
      });

      if (drugResponse.data.error) {
        throw new Error(drugResponse.data.error);
      }

      // Get pricing information
      const pricingResponse = await axios.post(`${API_BASE_URL}/get-pricing`, {
        drug_name: formData.drugName,
        zip_code: formData.zipCode
      });

      // Get generic alternatives
      const alternativesResponse = await axios.post(`${API_BASE_URL}/get-alternatives`, {
        drug_name: formData.drugName
      });

      setResults({
        drugInfo: drugResponse.data,
        pricing: pricingResponse.data,
        alternatives: alternativesResponse.data,
        loading: false,
        error: null
      });

    } catch (error) {
      setResults(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || error.message || 'An error occurred while searching'
      }));
    }
  };

  const handleReset = () => {
    setSearchData({ drugName: '', zipCode: '' });
    setResults({
      drugInfo: null,
      pricing: null,
      alternatives: null,
      loading: false,
      error: null
    });
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
            <Search className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Search for Drug Pricing</h2>
            <p className="text-gray-600">Enter a drug name and your ZIP code to compare prices</p>
          </div>
        </div>

        <DrugSearchForm 
          onSearch={handleSearch} 
          onReset={handleReset}
          loading={results.loading}
        />

        {results.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{results.error}</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {results.loading && (
        <div className="card text-center py-12">
          <Loader className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Searching for Drug Information</h3>
          <p className="text-gray-600">Please wait while we gather pricing data...</p>
        </div>
      )}

      {/* Results */}
      {!results.loading && results.drugInfo && !results.error && (
        <div className="space-y-8">
          {/* Drug Information */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-success-100 rounded-lg">
                <Package className="w-5 h-5 text-success-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Drug Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                <p className="text-gray-900 font-medium">{results.drugInfo.name}</p>
              </div>
              
              {results.drugInfo.generic_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                  <p className="text-gray-900">{results.drugInfo.generic_name}</p>
                </div>
              )}
              
              {results.drugInfo.brand_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                  <p className="text-gray-900">{results.drugInfo.brand_name}</p>
                </div>
              )}
              
              {results.drugInfo.manufacturer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <p className="text-gray-900">{results.drugInfo.manufacturer}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Results */}
          {results.pricing && results.pricing.pricing && (
            <PricingResults 
              pricing={results.pricing.pricing}
              zipCode={searchData.zipCode}
            />
          )}

          {/* Generic Alternatives */}
          {results.alternatives && results.alternatives.alternatives && (
            <GenericAlternatives 
              alternatives={results.alternatives.alternatives}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DrugPricingWidget;