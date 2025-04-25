import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Vendor } from "../types/vendor";

// Fix the Leaflet default icon issue
// This is a known issue with webpack and Leaflet
const defaultIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom marker for the selected vendor
const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// User location marker
const userLocationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Default city centers
const cityCenters = {
  'Mumbai': [19.0760, 72.8777],
  'Pune': [18.5204, 73.8567],
  'Bangalore': [12.9716, 77.5946],
  'Delhi': [28.7041, 77.1025],
  'Chennai': [13.0827, 80.2707],
  'All Cities': [20.5937, 78.9629] // Center of India
};

// Function to calculate center point of all vendor locations
const calculateMapCenter = (vendors) => {
  if (!vendors || vendors.length === 0) {
    // Default to center of India if no vendors
    return cityCenters['All Cities'];
  }

  const totalLat = vendors.reduce((acc, vendor) => acc + vendor.location.lat, 0);
  const totalLng = vendors.reduce((acc, vendor) => acc + vendor.location.lng, 0);

  return [totalLat / vendors.length, totalLng / vendors.length];
};

// Calculate distance between two points in km
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

// Sort vendors by distance from a point
const sortVendorsByDistance = (vendors, userLat, userLng) => {
  return [...vendors].sort((a, b) => {
    const distanceA = calculateDistance(userLat, userLng, a.location.lat, a.location.lng);
    const distanceB = calculateDistance(userLat, userLng, b.location.lat, b.location.lng);
    return distanceA - distanceB;
  });
};

// Location marker component to show user's location
const LocationMarker = ({ onLocationFound }) => {
  const [position, setPosition] = useState(null);
  const [locationInitialized, setLocationInitialized] = useState(false);
  const map = useMap();

  // Attempt to get location as soon as component mounts
  useEffect(() => {
    if (locationInitialized) return; // Skip if location already initialized
    
    console.log("🌍 Attempting to locate user via map.locate()...");
    
    // First try using map.locate
    map.locate({ 
      setView: true, 
      maxZoom: 16,
      enableHighAccuracy: true, 
      timeout: 10000, 
      maximumAge: 0,
      watch: false // Set this to false to prevent continuous updates
    });

    // Set up location event handlers
    const handleLocationFound = (e) => {
      console.log("📍 Location found via map:", e.latlng);
      setPosition([e.latlng.lat, e.latlng.lng]);
      setLocationInitialized(true);
      onLocationFound(e.latlng.lat, e.latlng.lng);
    };

    const handleLocationError = (e) => {
      console.error("❌ Map location error:", e.message);
      // Fall back to browser geolocation API
      console.log("🌍 Falling back to navigator.geolocation...");
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Success
            console.log("📍 Location found via navigator:", position.coords);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setPosition([lat, lng]);
            setLocationInitialized(true);
            onLocationFound(lat, lng);
            map.setView([lat, lng], 14);
          },
          (error) => {
            console.error("❌ Navigator geolocation error:", error.message);
            console.log("Unable to access your location. Please make sure location services are enabled in your browser settings.");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }
    };

    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);

    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
    };
  }, [map, onLocationFound, locationInitialized]);

  return position ? (
    <React.Fragment>
      <Marker position={position} icon={userLocationIcon}>
        <Popup>You are here</Popup>
      </Marker>
      <Circle 
        center={position} 
        radius={500} 
        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} 
      />
    </React.Fragment>
  ) : null;
};

// Simple wait time indicator component
const WaitTimeIndicator = ({ waitTime }) => {
  const getWaitTimeInfo = (time) => {
    if (time <= 10) {
      return { color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' };
    } else if (time <= 30) {
      return { color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400' };
    } else {
      return { color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' };
    }
  };

  const { color, textColor } = getWaitTimeInfo(waitTime);

  return (
    <div className="flex items-center justify-center">
      <div className={`inline-flex items-center justify-center ${color} text-white text-xs px-3 py-1 rounded-full font-medium`}>
        {waitTime} min
      </div>
    </div>
  );
};

// Component to update map view when data changes
const MapUpdater = ({ center, zoom, selectedVendor }) => {
  const map = useMap();
  
  useEffect(() => {
    // Skip if map is still animating
    if (map._animatingZoom) return;
    
    // Keep reference to previous values to prevent unnecessary updates
    const prevCenter = map.getCenter();
    const prevZoom = map.getZoom();
    
    if (selectedVendor) {
      const vendorPosition = [selectedVendor.location.lat, selectedVendor.location.lng];
      const isSamePosition = prevCenter.lat === vendorPosition[0] && prevCenter.lng === vendorPosition[1];
      
      if (!isSamePosition || prevZoom !== 16) {
        map.setView(vendorPosition, 16, { animate: true, duration: 0.5 });
      }
    } else {
      const isSamePosition = prevCenter.lat === center[0] && prevCenter.lng === center[1];
      
      if (!isSamePosition || prevZoom !== zoom) {
        map.setView(center, zoom, { animate: true, duration: 0.5 });
      }
    }
  }, [map, center, zoom, selectedVendor]);
  
  return null;
};

// Simple wait time reporter component
const WaitTimeReporter = ({ onSubmit }) => {
  const [waitTime, setWaitTime] = useState(15);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(waitTime);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md">
      <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 text-left">Report Current Wait Time</h3>
      <div className="flex flex-col space-y-3">
        <div>
          <label htmlFor="wait-time-slider" className="block text-sm text-gray-600 dark:text-gray-400 mb-1 text-left">
            How long is the current wait? ({waitTime} min)
          </label>
          <input
            id="wait-time-slider"
            type="range"
            min="5"
            max="60"
            step="5"
            value={waitTime}
            onChange={(e) => setWaitTime(parseInt(e.target.value))}
            className="w-full h-2 bg-orange-100 dark:bg-orange-800/30 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>5 min</span>
            <span>30 min</span>
            <span>60 min</span>
          </div>
        </div>
        <button
          type="submit"
          className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 w-full mt-2"
        >
          Submit Wait Time
        </button>
      </div>
    </form>
  );
};

// Client-side only component wrapper
const ClientOnly = ({ children, fallback = null }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? children : fallback;
};

function MapView({ vendors = [], selectedVendor = null, setSelectedVendor = () => {}, onLocationUpdate = () => {} }) {
  const [modalVendor, setModalVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showNearbyVendors, setShowNearbyVendors] = useState(false);
  const [localVendors, setLocalVendors] = useState(vendors);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Update local vendors when vendors prop changes
  useEffect(() => {
    if (showNearbyVendors && userLocation) {
      // Sort the current filtered vendors by distance
      const sortedVendors = sortVendorsByDistance(
        [...vendors], // Create a copy to avoid mutation
        userLocation[0], 
        userLocation[1]
      );
      setLocalVendors(sortedVendors);
      console.log('Effect: Sorted vendors by distance:', sortedVendors.length);
    } else {
      // Use the original vendors list
      setLocalVendors(vendors);
    }
  }, [vendors, showNearbyVendors, userLocation]);

  // Get the appropriate zoom level based on number of vendors and their distribution
  const getZoomLevel = React.useCallback(() => {
    if (localVendors.length === 0) return 5; // Zoom out for no vendors
    if (localVendors.length === 1) return 15; // Zoom in for a single vendor
    
    // Determine the city
    const city = localVendors[0]?.city;
    const allSameCity = localVendors.every(vendor => vendor.city === city);
    
    if (allSameCity) {
      return 12; // City level
    }
    
    return 5; // Country level
  }, [localVendors]);
  
  // Compute map center once to avoid re-renders
  const mapCenter = React.useMemo(() => {
    if (selectedVendor) {
      return [selectedVendor.location.lat, selectedVendor.location.lng];
    }
    if (userLocation) {
      return userLocation;
    }
    return calculateMapCenter(localVendors);
  }, [selectedVendor, userLocation, localVendors]);

  // Get zoom level based on state
  const zoom = React.useMemo(() => {
    return userLocation ? 14 : getZoomLevel();
  }, [userLocation, getZoomLevel]);
  
  // Function to handle viewing vendor details
  const handleViewDetails = (vendor) => {
    setModalVendor(vendor);
    setIsModalOpen(true);
  };
  
  // Handle user location found
  const handleLocationFound = (lat, lng) => {
    // Only update if the location has changed significantly
    if (!userLocation || 
        Math.abs(userLocation[0] - lat) > 0.0001 || 
        Math.abs(userLocation[1] - lng) > 0.0001) {
      
      const location = [lat, lng];
      setUserLocation(location);
      setIsRequestingLocation(false);
      
      // Notify parent component
      onLocationUpdate(location);
      
      if (showNearbyVendors) {
        setLocalVendors(sortVendorsByDistance(vendors, lat, lng));
      }
    }
  };
  
  // Toggle between showing all vendors or sorting by proximity
  const toggleNearbyVendors = () => {
    const newState = !showNearbyVendors;
    setShowNearbyVendors(newState);
    
    if (newState && userLocation) {
      // Apply sorting by distance for the filtered vendors
      const sortedVendors = sortVendorsByDistance(vendors, userLocation[0], userLocation[1]);
      setLocalVendors(sortedVendors);
      
      // Log for debugging
      console.log('Sorted vendors by distance:', sortedVendors.length);
    } else {
      // Reset to original vendors
      setLocalVendors(vendors);
      console.log('Reset to original vendors:', vendors.length);
    }
  };
  
  // Manual request for geolocation
  const requestLocation = () => {
    setIsRequestingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success
          handleLocationFound(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // Error
          console.error("❌ Geolocation error:", error.message);
          setIsRequestingLocation(false);
          alert(`Unable to get your location: ${error.message}. Please check your browser settings and ensure location access is allowed.`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsRequestingLocation(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Get distance text
  const getDistanceText = (vendor) => {
    if (!userLocation) return null;
    
    const distance = calculateDistance(
      userLocation[0], 
      userLocation[1], 
      vendor.location.lat, 
      vendor.location.lng
    );
    
    return distance < 1 
      ? `${Math.round(distance * 1000)}m away` 
      : `${distance.toFixed(1)}km away`;
  };

  // Add a wait time report to a vendor
  const addWaitTimeReport = (vendor, waitTime) => {
    // Generate a random user ID for now (in a real app, this would be from authenticated user)
    const userId = `user_${Math.floor(Math.random() * 10000)}`;
    
    // Create new report
    const newReport = {
      time: new Date().toISOString(),
      waitTime: waitTime,
      userId: userId
    };
    
    // Add report to vendor
    const updatedVendor = {
      ...vendor,
      waitTimeReports: [
        newReport,
        ...(vendor.waitTimeReports || [])
      ],
      // Update current wait time (in real app would use a weighted average)
      currentWaitTime: waitTime
    };
    
    // Update local vendors list
    setLocalVendors(
      localVendors.map(v => 
        v.id === updatedVendor.id ? updatedVendor : v
      )
    );
    
    // Update modal vendor if it's the one being updated
    if (modalVendor && modalVendor.id === updatedVendor.id) {
      setModalVendor(updatedVendor);
    }
    
    // Update selected vendor if it's the one being updated
    if (selectedVendor && selectedVendor.id === updatedVendor.id) {
      setSelectedVendor(updatedVendor);
    }
    
    return updatedVendor;
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 relative">
      <ClientOnly fallback={
        <div className="h-full flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading map...</div>
        </div>
      }>
        <MapContainer 
          center={mapCenter} 
          zoom={zoom} 
          className="h-full z-0"
          zoomControl={false}
          whenReady={() => setIsMapLoaded(true)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <LocationMarker onLocationFound={handleLocationFound} />
          
          {localVendors.map(vendor => (
            <Marker 
              key={vendor.id}
              position={[vendor.location.lat, vendor.location.lng]}
              icon={selectedVendor?.id === vendor.id ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => setSelectedVendor(vendor),
              }}
            >
              <Popup closeButton={true}>
                <div className="popup-content">
                  <h3 className="font-bold">{vendor.name}</h3>
                  
                  <div className="w-full mt-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Category:</span>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">{vendor.type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Location:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{vendor.city}</span>
                    </div>
                    
                    {vendor.rating && (
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Rating:</span>
                        <span className="text-yellow-500">
                          {'★'.repeat(Math.round(vendor.rating))}
                          <span className="text-gray-300 dark:text-gray-600">
                            {'★'.repeat(5 - Math.round(vendor.rating))}
                          </span>
                        </span>
                      </div>
                    )}
                    
                    {userLocation && (
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Distance:</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{getDistanceText(vendor)}</span>
                      </div>
                    )}
                  </div>
                  
                  {vendor.currentWaitTime !== undefined && (
                    <div className="my-2 w-full">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">Current Wait Time:</div>
                      <WaitTimeIndicator waitTime={vendor.currentWaitTime} />
                    </div>
                  )}
                  
                  <button 
                    className="mt-3 px-3 py-1.5 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 w-full font-medium"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent marker click
                      handleViewDetails(vendor);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          
          <MapUpdater center={mapCenter} zoom={zoom} selectedVendor={selectedVendor} />
        </MapContainer>
      </ClientOnly>
      
      {/* Location controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Add location request button if userLocation is not set */}
        {!userLocation && (
          <button 
            onClick={requestLocation}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-md hover:bg-blue-600 flex items-center text-sm"
            title="Get your current location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Get Location
          </button>
        )}
        
        {userLocation && (
          <button 
            onClick={toggleNearbyVendors}
            className={`${showNearbyVendors ? 'bg-blue-600' : 'bg-orange-500'} text-white px-3 py-1.5 rounded-md shadow-md hover:opacity-90 flex items-center text-sm`}
            title="Show vendors sorted by distance from your location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {showNearbyVendors ? 'Nearby' : 'Show Nearby'}
          </button>
        )}
      </div>
      
      {isModalOpen && modalVendor && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full z-10 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-left">{modalVendor.name}</h2>
            
            <div className="mb-4 text-left">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-800/50 dark:text-orange-200 text-sm rounded-full mr-2">
                {modalVendor.type}
              </span>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800/50 dark:text-blue-200 text-sm rounded-full">
                {modalVendor.city}
              </span>
              <div className="mt-1">
                <span className="text-yellow-500">{'★'.repeat(Math.round(modalVendor.rating))}</span>
                <span className="text-gray-300 dark:text-gray-600">{'★'.repeat(5 - Math.round(modalVendor.rating))}</span>
                <span className="ml-1 text-sm dark:text-gray-300">({modalVendor.rating.toFixed(1)})</span>
              </div>
              {modalVendor.currentWaitTime !== undefined && (
                <div className="mt-3 flex items-center">
                  <span className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mr-2">Current wait time:</span>
                  <WaitTimeIndicator waitTime={modalVendor.currentWaitTime} />
                </div>
              )}
            </div>
            
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-4 text-left">
              <div className="mb-3">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">Opening Hours</h3>
                <p className="text-gray-800 dark:text-gray-300">{modalVendor.openHours}</p>
              </div>
              
              <div className="mb-3">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mb-1">Location</h3>
                <p className="text-gray-800 dark:text-gray-300">
                  Coordinates: {modalVendor.location.lat.toFixed(4)}, {modalVendor.location.lng.toFixed(4)}
                </p>
                {userLocation && (
                  <p className="text-gray-800 dark:text-gray-300 mt-1">
                    Distance: {getDistanceText(modalVendor)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-left">
              <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300">{modalVendor.description}</p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md mr-2 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${modalVendor.location.lat},${modalVendor.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                View on Google Maps
              </a>
            </div>
            
            <WaitTimeReporter onSubmit={(submittedWaitTime) => {
              // Handle submitted wait time
              const updatedVendor = addWaitTimeReport(modalVendor, submittedWaitTime);
              alert(`Thank you for reporting a ${submittedWaitTime} minute wait time for ${updatedVendor.name}!`);
              setIsModalOpen(false);
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView; 