import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix missing default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});
const MapView = ({ vendors }) => {
  return (
    <MapContainer center={[20.5937, 78.5946]} zoom={7} style={{ height: '100vh'}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"

      />
      {vendors.map((vendor) => (
        <Marker key={vendor.id} position={[vendor.latitude, vendor.longitude]}>
          <Popup>
            <strong>{vendor.name}</strong> <br />
            Specialty: {vendor.specialty}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;