#!/usr/bin/env python3
"""
Simple test script to verify the backend API is working correctly
"""

import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_endpoint(endpoint, method='GET', data=None):
    """Test a specific endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data)
        elif method == 'DELETE':
            response = requests.delete(url)
        elif method == 'PUT':
            response = requests.put(url, json=data)
        
        print(f"{method} {endpoint}: {response.status_code}")
        if response.status_code != 200:
            print(f"  Error: {response.text}")
        else:
            try:
                print(f"  Response: {json.dumps(response.json(), indent=2)}")
            except:
                print(f"  Response: {response.text[:100]}...")
        return response
    except Exception as e:
        print(f"{method} {endpoint}: FAILED - {e}")
        return None

def main():
    print("Testing Python Backend API")
    print("=" * 30)
    
    # Test health check
    test_endpoint('/health')
    
    # Test resource types
    test_endpoint('/resource-types')
    
    # Test resources
    test_endpoint('/resources')
    
    # Test bookings
    test_endpoint('/bookings')
    
    # Test time slots
    test_endpoint('/timeslots')
    
    print("\nTest completed!")

if __name__ == '__main__':
    main()