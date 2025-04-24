# Indian Street Food Locator

An interactive web application that allows users to discover and explore Indian street food vendors on a map. This application provides a comprehensive view of street food options with detailed information about each vendor.

## Features

- **Split Screen Layout**: 
  - Left panel: Scrollable list of all street food vendors
  - Right panel: Interactive map showing vendor locations

- **Vendor Information**:
  - Name, description, and type of food
  - Rating with visual star representation
  - Opening hours
  - Precise location

- **Interactive Experience**:
  - Search vendors by name or food type
  - Click on vendors in the list to highlight them on the map
  - Click on map pins to view vendor information
  - Detailed modal view for each vendor

- **Responsive Design**:
  - Works on desktop and mobile devices

## Technologies Used

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Map Integration**: Leaflet with OpenStreetMap
- **Data**: Static JSON (mock data)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/streetfood-locator.git
   ```

2. Navigate to the project directory:
   ```
   cd streetfood-locator
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Future Enhancements

- User geolocation support
- Filters for food types, ratings, etc.
- Dark mode toggle
- User reviews and ratings
- Route planning to vendors
- Backend integration with real-time data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenStreetMap for providing the map data
- React and Leaflet communities for excellent documentation
