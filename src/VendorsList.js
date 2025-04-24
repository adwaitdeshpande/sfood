import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapView from './MapView';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


const VendorsList = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:5002/vendors');
        console.log('Fetched vendors:', response.data); 
        

      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div>
      {/* <h1>Street Food Vendors</h1> */}
      <MapView vendors={vendors} />
      <ul>
        {vendors.map((vendor) => (
          <li key={vendor.id} >
            <strong>{vendor.name}</strong> - {vendor.specialty}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorsList;