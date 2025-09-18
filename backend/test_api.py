#!/usr/bin/env python3
"""
Test script for the Drug Pricing Transparency API
"""

import requests
import json
import sys

API_BASE_URL = "http://localhost:5000/api"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_drug_search():
    """Test drug search functionality"""
    print("\nTesting drug search...")
    test_drugs = ["Lipitor", "Metformin", "Lisinopril"]
    
    for drug in test_drugs:
        try:
            response = requests.post(f"{API_BASE_URL}/search-drug", 
                                   json={"drug_name": drug})
            if response.status_code == 200:
                data = response.json()
                if "error" not in data:
                    print(f"✅ Drug search for '{drug}' passed")
                    print(f"   Found: {data.get('name', 'Unknown')}")
                else:
                    print(f"⚠️  Drug search for '{drug}' returned error: {data['error']}")
            else:
                print(f"❌ Drug search for '{drug}' failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Drug search for '{drug}' failed: {e}")

def test_pricing():
    """Test pricing functionality"""
    print("\nTesting pricing...")
    test_cases = [
        {"drug_name": "Lipitor", "zip_code": "10001"},
        {"drug_name": "Metformin", "zip_code": "90210"}
    ]
    
    for test_case in test_cases:
        try:
            response = requests.post(f"{API_BASE_URL}/get-pricing", 
                                   json=test_case)
            if response.status_code == 200:
                data = response.json()
                if "pricing" in data and data["pricing"]:
                    print(f"✅ Pricing for '{test_case['drug_name']}' in {test_case['zip_code']} passed")
                    print(f"   Found {len(data['pricing'])} pricing options")
                else:
                    print(f"⚠️  No pricing data for '{test_case['drug_name']}'")
            else:
                print(f"❌ Pricing for '{test_case['drug_name']}' failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Pricing for '{test_case['drug_name']}' failed: {e}")

def test_alternatives():
    """Test generic alternatives functionality"""
    print("\nTesting generic alternatives...")
    test_drugs = ["Lipitor", "Metformin"]
    
    for drug in test_drugs:
        try:
            response = requests.post(f"{API_BASE_URL}/get-alternatives", 
                                   json={"drug_name": drug})
            if response.status_code == 200:
                data = response.json()
                if "alternatives" in data:
                    print(f"✅ Alternatives for '{drug}' passed")
                    print(f"   Found {len(data['alternatives'])} alternatives")
                else:
                    print(f"⚠️  No alternatives found for '{drug}'")
            else:
                print(f"❌ Alternatives for '{drug}' failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Alternatives for '{drug}' failed: {e}")

def main():
    """Run all tests"""
    print("🧪 Drug Pricing Transparency API Tests")
    print("=" * 50)
    
    # Test health check first
    if not test_health_check():
        print("\n❌ Health check failed. Is the server running?")
        print("   Start the server with: python backend/run.py")
        sys.exit(1)
    
    # Run other tests
    test_drug_search()
    test_pricing()
    test_alternatives()
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")

if __name__ == "__main__":
    main()