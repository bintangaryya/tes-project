'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface Lokasi {
  nama: string;
  lat: number;
  lng: number;
  estimasi: string;
  tipe: 'hemat' | 'sedang' | 'fancy';
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function getIcon() {
  return defaultIcon;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

function markerColor(tipe: string) {
  switch (tipe) {
    case 'hemat': return 'bg-green-500';
    case 'sedang': return 'bg-blue-500';
    case 'fancy': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
}

export default function MapComponent({
  center,
  lokasi,
}: {
  center: [number, number];
  lokasi: Lokasi[];
}) {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={center} />
        {lokasi.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]} icon={getIcon()}>
            <Popup>
              <div className="text-center min-w-[150px]">
                <p className="font-semibold text-gray-800">{loc.nama}</p>
                <p className="text-sm text-gray-600 mt-1">{loc.estimasi}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full text-white ${markerColor(loc.tipe)}`}>
                  {loc.tipe.charAt(0).toUpperCase() + loc.tipe.slice(1)}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
