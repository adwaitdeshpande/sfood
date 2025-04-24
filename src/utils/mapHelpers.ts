import L from "leaflet";
import { Vendor } from "../types/vendor";

type LatLngTuple = [number, number];

// Calculate the center of all vendor locations
export const calculateMapCenter = (vendors: Vendor[]): LatLngTuple => {
  if (vendors.length === 0) {
    // Default to Mumbai center if no vendors
    return [18.9387, 72.8353];
  }

  const totalLat = vendors.reduce((acc, vendor) => acc + vendor.location.lat, 0);
  const totalLng = vendors.reduce((acc, vendor) => acc + vendor.location.lng, 0);

  return [totalLat / vendors.length, totalLng / vendors.length];
};

// Calculate distance between two coordinates using the Haversine formula
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

// Sort vendors by distance from user location
export const sortVendorsByDistance = (
  vendors: Vendor[], 
  userLat: number, 
  userLng: number
): Vendor[] => {
  return [...vendors].sort((a, b) => {
    const distanceA = calculateDistance(
      userLat, 
      userLng, 
      a.location.lat, 
      a.location.lng
    );
    const distanceB = calculateDistance(
      userLat, 
      userLng, 
      b.location.lat, 
      b.location.lng
    );
    return distanceA - distanceB;
  });
};

// Get nearest vendors limited by count
export const getNearestVendors = (
  vendors: Vendor[],
  userLat: number,
  userLng: number,
  limit: number = 5
): Vendor[] => {
  const sortedVendors = sortVendorsByDistance(vendors, userLat, userLng);
  return sortedVendors.slice(0, limit);
};

// Find the vendor by ID
export const findVendorById = (vendors: Vendor[], id: number): Vendor | undefined => {
  return vendors.find(vendor => vendor.id === id);
};

// Filter vendors by search term
export const filterVendors = (vendors: Vendor[], searchTerm: string): Vendor[] => {
  if (!searchTerm.trim()) {
    return vendors;
  }
  
  const term = searchTerm.toLowerCase();
  return vendors.filter(
    vendor => 
      vendor.name.toLowerCase().includes(term) || 
      vendor.type.toLowerCase().includes(term) ||
      vendor.description.toLowerCase().includes(term)
  );
}; 