#!/usr/bin/env python3
"""
Drug Pricing Transparency Widget - Backend Server
"""

from app import app

if __name__ == '__main__':
    print("Starting Drug Pricing Transparency API Server...")
    print("API will be available at: http://localhost:5000")
    print("Health check: http://localhost:5000/api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)