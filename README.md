# Drug Pricing Transparency Widget

A comprehensive web application that helps Medicare beneficiaries compare prescription drug prices across different plans and pharmacies, with suggestions for cost-effective generic alternatives.

## Features

- **Drug Search**: Search by brand name or generic name using OpenFDA API
- **Price Comparison**: Compare costs across different Medicare Part D and Medicare Advantage plans
- **Pharmacy Options**: View pricing for retail pharmacies, mail-order, and preferred pharmacies
- **Generic Alternatives**: Get suggestions for lower-cost generic alternatives with estimated savings
- **Interactive UI**: Modern, responsive interface with filtering and sorting capabilities
- **Real-time Data**: Cached API responses for better performance

## Tech Stack

### Backend
- **Python Flask**: RESTful API server
- **OpenFDA API**: Drug information and labeling data
- **SQLite**: Local caching for improved performance
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client for API calls

## Project Structure

```
/workspace
├── backend/
│   ├── app.py              # Main Flask application
│   └── run.py              # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # React entry point
│   ├── public/
│   └── package.json        # Frontend dependencies
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Install Python dependencies**:
   ```bash
   cd /workspace
   pip install -r requirements.txt
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys (optional)
   ```

3. **Start the backend server**:
   ```bash
   cd backend
   python run.py
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## API Endpoints

### Backend API (`http://localhost:5000/api`)

- `POST /search-drug` - Search for drug information
  ```json
  {
    "drug_name": "Lipitor"
  }
  ```

- `POST /get-pricing` - Get pricing information by ZIP code
  ```json
  {
    "drug_name": "Lipitor",
    "zip_code": "12345"
  }
  ```

- `POST /get-alternatives` - Get generic alternatives
  ```json
  {
    "drug_name": "Lipitor"
  }
  ```

- `GET /health` - Health check endpoint

## Data Sources

- **OpenFDA API**: Drug labeling and adverse event data
- **Medicare.gov**: Plan information and drug pricing data
- **CMS Drug Spending Data**: Historical pricing information

## Features in Detail

### Drug Search
- Searches both brand names and generic names
- Caches results in SQLite database for performance
- Validates drug names against OpenFDA database

### Pricing Comparison
- Shows costs across different Medicare plan types:
  - Medicare Part D Standard Plans
  - Medicare Advantage PPO Plans
  - Medicare Advantage HMO Plans
- Displays pricing for different pharmacy types:
  - Retail Pharmacies
  - Mail Order Pharmacies
  - Preferred Pharmacies

### Generic Alternatives
- Suggests lower-cost generic alternatives
- Provides estimated savings percentages
- Shows availability status

### User Interface
- Responsive design that works on all devices
- Interactive filtering and sorting
- Color-coded pricing (green for low, red for high)
- Summary statistics and cost comparisons

## Development Notes

### Data Caching
The application uses SQLite to cache drug information and pricing data to improve performance and reduce API calls.

### Error Handling
Comprehensive error handling for:
- Invalid drug names
- Network connectivity issues
- API rate limiting
- Invalid ZIP codes

### Security Considerations
- No personal health information is stored
- ZIP codes are validated for format
- API keys are stored in environment variables
- CORS is properly configured

## Future Enhancements

1. **Real Medicare API Integration**: Connect to actual Medicare.gov APIs for real pricing data
2. **User Accounts**: Allow users to save favorite drugs and pricing comparisons
3. **Mobile App**: Native mobile applications for iOS and Android
4. **Advanced Filtering**: Filter by specific plan providers or pharmacy chains
5. **Cost Calculator**: Calculate annual drug costs based on prescription frequency
6. **Provider Directory**: Integration with pharmacy location services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for educational and informational purposes only. Pricing information is simulated and may not reflect actual costs. Always consult with healthcare providers and insurance companies for accurate pricing information. The tool does not provide medical advice or recommendations.