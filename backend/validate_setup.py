#!/usr/bin/env python3
"""
Script to validate the Python backend setup
"""

import sys
import os

def check_python_version():
    """Check if Python version is sufficient"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python version 3.8+ required, found {version.major}.{version.minor}")
        return False
    else:
        print(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
        return True

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = ['flask', 'flask_cors', 'requests']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}: Available")
        except ImportError:
            print(f"❌ {package}: Missing")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n💡 Install missing packages with: pip install {' '.join(missing_packages)}")
        return False
    
    return True

def check_files():
    """Check if required files exist"""
    required_files = [
        'api.py',
        'init_db.py',
        'reset_db.py',
        'check_backend.py',
        'requirements.txt',
        'resources.sql',
        'bookings.sql',
        'timeslots.sql'
    ]
    
    missing_files = []
    
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file}: Found")
        else:
            print(f"❌ {file}: Missing")
            missing_files.append(file)
    
    return len(missing_files) == 0

def main():
    """Main validation function"""
    print("Python Backend Setup Validation")
    print("=" * 32)
    
    # Change to backend directory if not already there
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    print(f"Working directory: {os.getcwd()}")
    print()
    
    # Run all checks
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Files", check_files)
    ]
    
    results = []
    for check_name, check_func in checks:
        print(f"\n{check_name} Check:")
        print("-" * (len(check_name) + 6))
        result = check_func()
        results.append(result)
    
    print("\n" + "=" * 32)
    if all(results):
        print("🎉 All checks passed! The backend is ready to use.")
        print("\nTo start the backend:")
        print("1. Run: python init_db.py  # Initialize database")
        print("2. Run: python api.py      # Start server")
        print("3. The API will be available at http://localhost:5000")
    else:
        print("⚠️  Some checks failed. Please address the issues above.")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())