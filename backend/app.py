from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from typing import Dict, List, Optional
import json
import sqlite3
import random
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
OPENFDA_API_KEY = os.getenv('OPENFDA_API_KEY', '')
MEDICARE_API_KEY = os.getenv('MEDICARE_API_KEY', '')

class DrugPricingService:
    def __init__(self):
        self.openfda_base_url = "https://api.fda.gov"
        self.medicare_base_url = "https://data.cms.gov"
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database for caching drug data"""
        self.conn = sqlite3.connect('drug_pricing.db', check_same_thread=False)
        cursor = self.conn.cursor()
        
        # Create tables for caching
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS drugs (
                id INTEGER PRIMARY KEY,
                name TEXT UNIQUE,
                generic_name TEXT,
                brand_name TEXT,
                ndc TEXT,
                manufacturer TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pricing_cache (
                id INTEGER PRIMARY KEY,
                drug_name TEXT,
                zip_code TEXT,
                plan_type TEXT,
                pharmacy_type TEXT,
                cost REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        self.conn.commit()
    
    def search_drug_by_name(self, drug_name: str) -> Dict:
        """Search for drug information using OpenFDA API"""
        try:
            # Check cache first
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM drugs WHERE name LIKE ?', (f'%{drug_name}%',))
            cached_result = cursor.fetchone()
            
            if cached_result:
                return {
                    'name': cached_result[1],
                    'generic_name': cached_result[2],
                    'brand_name': cached_result[3],
                    'ndc': cached_result[4],
                    'manufacturer': cached_result[5]
                }
            
            # Query OpenFDA API
            url = f"{self.openfda_base_url}/drug/label.json"
            params = {
                'search': f'openfda.brand_name:"{drug_name}" OR openfda.generic_name:"{drug_name}"',
                'limit': 1
            }
            
            if OPENFDA_API_KEY:
                params['api_key'] = OPENFDA_API_KEY
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('results'):
                    drug_info = data['results'][0]
                    openfda = drug_info.get('openfda', {})
                    
                    result = {
                        'name': drug_name,
                        'generic_name': ', '.join(openfda.get('generic_name', [drug_name])),
                        'brand_name': ', '.join(openfda.get('brand_name', [drug_name])),
                        'ndc': ', '.join(openfda.get('product_ndc', [])),
                        'manufacturer': ', '.join(openfda.get('manufacturer_name', []))
                    }
                    
                    # Cache the result
                    cursor.execute('''
                        INSERT OR REPLACE INTO drugs 
                        (name, generic_name, brand_name, ndc, manufacturer)
                        VALUES (?, ?, ?, ?, ?)
                    ''', (drug_name, result['generic_name'], result['brand_name'], 
                          result['ndc'], result['manufacturer']))
                    self.conn.commit()
                    
                    return result
            
            return {'error': 'Drug not found'}
            
        except Exception as e:
            return {'error': f'Error searching drug: {str(e)}'}
    
    def get_pricing_by_zip(self, drug_name: str, zip_code: str) -> Dict:
        """Get pricing information for a drug by ZIP code"""
        try:
            # Check cache first
            cursor = self.conn.cursor()
            cursor.execute('''
                SELECT * FROM pricing_cache 
                WHERE drug_name = ? AND zip_code = ?
                AND created_at > datetime('now', '-1 day')
            ''', (drug_name, zip_code))
            cached_results = cursor.fetchall()
            
            if cached_results:
                pricing_data = []
                for row in cached_results:
                    pricing_data.append({
                        'plan_type': row[3],
                        'pharmacy_type': row[4],
                        'cost': row[5]
                    })
                return {'pricing': pricing_data}
            
            # Simulate pricing data (in real implementation, this would query Medicare APIs)
            # Note: Actual Medicare pricing APIs may require special access
            pricing_data = self._generate_sample_pricing(drug_name, zip_code)
            
            # Cache the results
            for pricing in pricing_data:
                cursor.execute('''
                    INSERT INTO pricing_cache 
                    (drug_name, zip_code, plan_type, pharmacy_type, cost)
                    VALUES (?, ?, ?, ?, ?)
                ''', (drug_name, zip_code, pricing['plan_type'], 
                      pricing['pharmacy_type'], pricing['cost']))
            
            self.conn.commit()
            
            return {'pricing': pricing_data}
            
        except Exception as e:
            return {'error': f'Error getting pricing: {str(e)}'}
    
    def _generate_sample_pricing(self, drug_name: str, zip_code: str) -> List[Dict]:
        """Generate sample pricing data (replace with actual API calls)"""
        import random
        
        # Sample plan types and pharmacy types
        plan_types = ['Medicare Part D Standard', 'Medicare Advantage PPO', 'Medicare Advantage HMO']
        pharmacy_types = ['Retail Pharmacy', 'Mail Order', 'Preferred Pharmacy']
        
        pricing_data = []
        base_cost = random.uniform(50, 300)  # Random base cost
        
        for plan in plan_types:
            for pharmacy in pharmacy_types:
                # Simulate cost variations
                multiplier = random.uniform(0.7, 1.3)
                cost = round(base_cost * multiplier, 2)
                
                pricing_data.append({
                    'plan_type': plan,
                    'pharmacy_type': pharmacy,
                    'cost': cost,
                    'copay': round(cost * 0.2, 2),  # Assume 20% copay
                    'deductible': round(cost * 0.8, 2)  # Assume 80% deductible
                })
        
        return pricing_data
    
    def get_generic_alternatives(self, drug_name: str) -> Dict:
        """Get generic alternatives for a drug"""
        try:
            # Search for generic alternatives using OpenFDA
            url = f"{self.openfda_base_url}/drug/label.json"
            params = {
                'search': f'openfda.generic_name:"{drug_name}"',
                'limit': 5
            }
            
            if OPENFDA_API_KEY:
                params['api_key'] = OPENFDA_API_KEY
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                alternatives = []
                
                if data.get('results'):
                    for result in data['results'][:3]:  # Top 3 alternatives
                        openfda = result.get('openfda', {})
                        generic_name = ', '.join(openfda.get('generic_name', []))
                        
                        if generic_name and generic_name != drug_name:
                            alternatives.append({
                                'name': generic_name,
                                'estimated_savings': round(random.uniform(20, 70), 1),  # 20-70% savings
                                'availability': 'Available'
                            })
                
                return {'alternatives': alternatives}
            
            return {'alternatives': []}
            
        except Exception as e:
            return {'error': f'Error getting alternatives: {str(e)}'}

# Initialize the service
pricing_service = DrugPricingService()

@app.route('/api/search-drug', methods=['POST'])
def search_drug():
    """Search for a drug by name"""
    data = request.get_json()
    drug_name = data.get('drug_name', '').strip()
    
    if not drug_name:
        return jsonify({'error': 'Drug name is required'}), 400
    
    result = pricing_service.search_drug_by_name(drug_name)
    return jsonify(result)

@app.route('/api/get-pricing', methods=['POST'])
def get_pricing():
    """Get pricing information for a drug by ZIP code"""
    data = request.get_json()
    drug_name = data.get('drug_name', '').strip()
    zip_code = data.get('zip_code', '').strip()
    
    if not drug_name or not zip_code:
        return jsonify({'error': 'Drug name and ZIP code are required'}), 400
    
    # Validate ZIP code format (basic validation)
    if not zip_code.isdigit() or len(zip_code) != 5:
        return jsonify({'error': 'Invalid ZIP code format'}), 400
    
    result = pricing_service.get_pricing_by_zip(drug_name, zip_code)
    return jsonify(result)

@app.route('/api/get-alternatives', methods=['POST'])
def get_alternatives():
    """Get generic alternatives for a drug"""
    data = request.get_json()
    drug_name = data.get('drug_name', '').strip()
    
    if not drug_name:
        return jsonify({'error': 'Drug name is required'}), 400
    
    result = pricing_service.get_generic_alternatives(drug_name)
    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)