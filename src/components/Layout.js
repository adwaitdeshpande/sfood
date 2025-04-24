import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MapView from './MapView';
import vendorsData from '../data/vendors.json';

// Calculate distance between coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Format distance for display
const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  }
  return `${distance.toFixed(1)}km away`;
};

function Layout() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [userLocation, setUserLocation] = useState(null);

  // Load vendor data on component mount
  useEffect(() => {
    setVendors(vendorsData || []);
  }, []);

  // Filter vendors when search term or city changes
  useEffect(() => {
    let filtered = vendors;
    
    // Filter by city if a specific city is selected
    if (selectedCity !== 'All Cities') {
      filtered = filtered.filter(vendor => vendor.city === selectedCity);
    }
    
    // Filter by search term if provided
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        vendor => 
          vendor.name.toLowerCase().includes(term) || 
          vendor.type.toLowerCase().includes(term) ||
          vendor.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredVendors(filtered);
    
    // Clear selected vendor when changing filters
    setSelectedVendor(null);
  }, [searchTerm, vendors, selectedCity]);
  
  // Handle when user location is updated from MapView
  const handleLocationUpdate = (location) => {
    setUserLocation(location);
  };
  
  // Calculate distance for a vendor
  const getVendorDistanceText = (vendor) => {
    if (!userLocation || !vendor.location) return null;
    
    const distance = calculateDistance(
      userLocation[0],
      userLocation[1],
      vendor.location.lat,
      vendor.location.lng
    );
    
    return formatDistance(distance);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors duration-200">
      <div className="w-full md:w-1/3 h-1/2 md:h-screen overflow-auto shadow-md">
        <Sidebar 
          vendors={filteredVendors} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedVendor={selectedVendor}
          setSelectedVendor={setSelectedVendor}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          getVendorDistanceText={getVendorDistanceText}
        />
      </div>
      <div className="w-full md:w-2/3 h-1/2 md:h-screen bg-white dark:bg-gray-800">
        <MapView 
          vendors={filteredVendors}
          selectedVendor={selectedVendor}
          setSelectedVendor={setSelectedVendor}
          onLocationUpdate={handleLocationUpdate}
        />
      </div>
    </div>
  );
}

export default Layout; 