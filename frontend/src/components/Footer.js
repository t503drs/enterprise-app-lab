import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About This Tool</h3>
            <p className="text-gray-300 text-sm">
              This drug pricing transparency tool helps Medicare beneficiaries 
              compare prescription drug costs across different plans and pharmacies.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• OpenFDA Drug Database</li>
              <li>• Medicare.gov Plan Data</li>
              <li>• CMS Drug Spending Data</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
            <p className="text-gray-300 text-sm">
              Pricing information is for comparison purposes only. 
              Actual costs may vary based on your specific plan and pharmacy.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Drug Pricing Transparency Tool. Educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;