import React, { useState } from 'react';
import { DollarSign, Building2, Truck, SortAsc, SortDesc, Filter } from 'lucide-react';

const PricingResults = ({ pricing, zipCode }) => {
  const [sortBy, setSortBy] = useState('cost');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterPharmacy, setFilterPharmacy] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  // Filter and sort pricing data
  const filteredAndSortedPricing = pricing
    .filter(item => {
      if (filterPharmacy !== 'all' && !item.pharmacy_type.toLowerCase().includes(filterPharmacy)) {
        return false;
      }
      if (filterPlan !== 'all' && !item.plan_type.toLowerCase().includes(filterPlan)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'cost':
          aValue = a.cost;
          bValue = b.cost;
          break;
        case 'copay':
          aValue = a.copay;
          bValue = b.copay;
          break;
        case 'plan':
          aValue = a.plan_type;
          bValue = b.plan_type;
          break;
        default:
          aValue = a.cost;
          bValue = b.cost;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getPharmacyIcon = (pharmacyType) => {
    if (pharmacyType.toLowerCase().includes('retail')) {
      return <Building2 className="w-4 h-4" />;
    } else if (pharmacyType.toLowerCase().includes('mail')) {
      return <Truck className="w-4 h-4" />;
    } else {
      return <Building2 className="w-4 h-4" />;
    }
  };

  const getCostColor = (cost) => {
    if (cost < 50) return 'text-green-600';
    if (cost < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const uniquePlans = [...new Set(pricing.map(item => item.plan_type))];
  const uniquePharmacies = [...new Set(pricing.map(item => item.pharmacy_type))];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pricing Results</h2>
            <p className="text-gray-600">ZIP Code: {zipCode}</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          {filteredAndSortedPricing.length} results found
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Plan</label>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="input-field"
          >
            <option value="all">All Plans</option>
            {uniquePlans.map(plan => (
              <option key={plan} value={plan.toLowerCase()}>{plan}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Pharmacy</label>
          <select
            value={filterPharmacy}
            onChange={(e) => setFilterPharmacy(e.target.value)}
            className="input-field"
          >
            <option value="all">All Pharmacies</option>
            {uniquePharmacies.map(pharmacy => (
              <option key={pharmacy} value={pharmacy.toLowerCase()}>{pharmacy}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="cost">Total Cost</option>
            <option value="copay">Copay</option>
            <option value="plan">Plan Type</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn-secondary flex items-center space-x-2 w-full"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pharmacy Type
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('cost')}
              >
                <div className="flex items-center space-x-1">
                  <span>Total Cost</span>
                  {sortBy === 'cost' && (
                    sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('copay')}
              >
                <div className="flex items-center space-x-1">
                  <span>Copay</span>
                  {sortBy === 'copay' && (
                    sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deductible
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedPricing.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.plan_type}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getPharmacyIcon(item.pharmacy_type)}
                    <span className="text-sm text-gray-900">{item.pharmacy_type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${getCostColor(item.cost)}`}>
                    ${item.cost.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${item.copay.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${item.deductible.toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {filteredAndSortedPricing.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-900 mb-1">Lowest Cost</h4>
            <p className="text-2xl font-bold text-green-600">
              ${Math.min(...filteredAndSortedPricing.map(item => item.cost)).toFixed(2)}
            </p>
            <p className="text-sm text-green-700">
              {filteredAndSortedPricing.find(item => 
                item.cost === Math.min(...filteredAndSortedPricing.map(item => item.cost))
              )?.pharmacy_type}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Average Cost</h4>
            <p className="text-2xl font-bold text-blue-600">
              ${(filteredAndSortedPricing.reduce((sum, item) => sum + item.cost, 0) / filteredAndSortedPricing.length).toFixed(2)}
            </p>
            <p className="text-sm text-blue-700">Across all options</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-900 mb-1">Highest Cost</h4>
            <p className="text-2xl font-bold text-red-600">
              ${Math.max(...filteredAndSortedPricing.map(item => item.cost)).toFixed(2)}
            </p>
            <p className="text-sm text-red-700">
              {filteredAndSortedPricing.find(item => 
                item.cost === Math.max(...filteredAndSortedPricing.map(item => item.cost))
              )?.pharmacy_type}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingResults;