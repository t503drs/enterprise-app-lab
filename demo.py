#!/usr/bin/env python3
"""
Demo script for the Drug Pricing Transparency Widget
This script demonstrates the key features of the application.
"""

import requests
import time
import json

API_BASE_URL = "http://localhost:5000/api"

def print_header(title):
    """Print a formatted header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def print_result(title, data):
    """Print a formatted result"""
    print(f"\n📊 {title}")
    print("-" * 40)
    if isinstance(data, dict):
        for key, value in data.items():
            print(f"{key}: {value}")
    elif isinstance(data, list):
        for i, item in enumerate(data, 1):
            print(f"{i}. {item}")
    else:
        print(data)

def demo_drug_search():
    """Demonstrate drug search functionality"""
    print_header("DRUG SEARCH DEMO")
    
    test_drugs = ["Lipitor", "Metformin", "Aspirin"]
    
    for drug in test_drugs:
        print(f"\n🔍 Searching for: {drug}")
        try:
            response = requests.post(f"{API_BASE_URL}/search-drug", 
                                   json={"drug_name": drug})
            
            if response.status_code == 200:
                data = response.json()
                if "error" not in data:
                    print(f"✅ Found: {data.get('name', 'Unknown')}")
                    if data.get('generic_name'):
                        print(f"   Generic: {data['generic_name']}")
                    if data.get('brand_name'):
                        print(f"   Brand: {data['brand_name']}")
                    if data.get('manufacturer'):
                        print(f"   Manufacturer: {data['manufacturer']}")
                else:
                    print(f"❌ Error: {data['error']}")
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Connection Error: Is the backend server running?")
            return False
        except Exception as e:
            print(f"❌ Error: {e}")
    
    return True

def demo_pricing_comparison():
    """Demonstrate pricing comparison functionality"""
    print_header("PRICING COMPARISON DEMO")
    
    test_cases = [
        {"drug": "Lipitor", "zip": "10001", "location": "New York, NY"},
        {"drug": "Metformin", "zip": "90210", "location": "Beverly Hills, CA"}
    ]
    
    for case in test_cases:
        print(f"\n💰 Pricing for {case['drug']} in {case['location']} ({case['zip']})")
        try:
            response = requests.post(f"{API_BASE_URL}/get-pricing", 
                                   json={"drug_name": case["drug"], "zip_code": case["zip"]})
            
            if response.status_code == 200:
                data = response.json()
                if "pricing" in data and data["pricing"]:
                    pricing = data["pricing"]
                    
                    # Show summary statistics
                    costs = [item["cost"] for item in pricing]
                    min_cost = min(costs)
                    max_cost = max(costs)
                    avg_cost = sum(costs) / len(costs)
                    
                    print(f"   📈 Cost Range: ${min_cost:.2f} - ${max_cost:.2f}")
                    print(f"   📊 Average Cost: ${avg_cost:.2f}")
                    print(f"   📋 Total Options: {len(pricing)}")
                    
                    # Show top 3 cheapest options
                    sorted_pricing = sorted(pricing, key=lambda x: x["cost"])[:3]
                    print(f"\n   🏆 Top 3 Cheapest Options:")
                    for i, item in enumerate(sorted_pricing, 1):
                        print(f"      {i}. {item['plan_type']} - {item['pharmacy_type']}: ${item['cost']:.2f}")
                        
                else:
                    print("   ⚠️  No pricing data available")
            else:
                print(f"   ❌ HTTP Error: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

def demo_generic_alternatives():
    """Demonstrate generic alternatives functionality"""
    print_header("GENERIC ALTERNATIVES DEMO")
    
    test_drugs = ["Lipitor", "Metformin"]
    
    for drug in test_drugs:
        print(f"\n💊 Generic alternatives for: {drug}")
        try:
            response = requests.post(f"{API_BASE_URL}/get-alternatives", 
                                   json={"drug_name": drug})
            
            if response.status_code == 200:
                data = response.json()
                if "alternatives" in data and data["alternatives"]:
                    alternatives = data["alternatives"]
                    print(f"   ✅ Found {len(alternatives)} alternatives:")
                    
                    for i, alt in enumerate(alternatives, 1):
                        print(f"      {i}. {alt['name']}")
                        print(f"         💰 Estimated Savings: {alt['estimated_savings']}%")
                        print(f"         📦 Availability: {alt['availability']}")
                else:
                    print("   ⚠️  No generic alternatives found")
            else:
                print(f"   ❌ HTTP Error: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

def check_server_status():
    """Check if the server is running"""
    print_header("SERVER STATUS CHECK")
    
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend server is running!")
            print(f"   Status: {data.get('status', 'unknown')}")
            print(f"   Timestamp: {data.get('timestamp', 'unknown')}")
            return True
        else:
            print(f"❌ Server responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
        print("   Please start the server with: python backend/run.py")
        return False
    except Exception as e:
        print(f"❌ Error checking server: {e}")
        return False

def main():
    """Run the complete demo"""
    print("🎯 DRUG PRICING TRANSPARENCY WIDGET - DEMO")
    print("This demo showcases the key features of the application.")
    print("\nNote: This demo requires the backend server to be running.")
    print("Start it with: python backend/run.py")
    
    # Check server status first
    if not check_server_status():
        print("\n❌ Demo cannot continue without the backend server.")
        return
    
    # Run demos
    demo_drug_search()
    demo_pricing_comparison()
    demo_generic_alternatives()
    
    print_header("DEMO COMPLETED")
    print("🎉 Thank you for trying the Drug Pricing Transparency Widget!")
    print("\nNext steps:")
    print("1. Start the frontend: cd frontend && npm start")
    print("2. Open http://localhost:3000 in your browser")
    print("3. Try searching for different drugs and ZIP codes")

if __name__ == "__main__":
    main()