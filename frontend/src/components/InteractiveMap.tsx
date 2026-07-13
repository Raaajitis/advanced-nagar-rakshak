"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Issue } from "@/types";
import { getImageUrl } from "./IssueCard";

// Custom SVG icon generator for leaflets
const getMarkerIcon = (status: string) => {
  let color = "#EAB308"; // Pending (Yellow)
  if (status === "Resolved") color = "#10B981"; // Resolved (Emerald)
  if (status === "In Progress") color = "#F97316"; // In Progress (Orange)
  if (status === "select") color = "#3B82F6"; // Selection marker (Blue)

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36px" height="36px" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "custom-leaflet-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

interface InteractiveMapProps {
  issues?: Issue[];
  center?: [number, number];
  zoom?: number;
  interactive?: boolean; // Can click to place marker
  selectedLocation?: [number, number] | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  className?: string;
  onViewIssueDetails?: (issue: Issue) => void;
}

const MapEventsHandler: React.FC<{
  onMapClick?: (lat: number, lng: number) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  issues = [],
  center = [19.076, 72.8777], // Default to Mumbai
  zoom = 12,
  interactive = false,
  selectedLocation = null,
  onLocationSelect,
  className = "h-[450px] w-full rounded-3xl",
  onViewIssueDetails,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  // Recenter map if single selected location updates
  useEffect(() => {
    if (selectedLocation) {
      setMapCenter(selectedLocation);
    } else if (issues.length === 1) {
      setMapCenter([issues[0].latitude, issues[0].longitude]);
    }
  }, [selectedLocation, issues]);

  const handleMapClick = (lat: number, lng: number) => {
    if (interactive && onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  };

  return (
    <div className={`overflow-hidden border border-zinc-150 shadow-md dark:border-zinc-800 relative z-10 ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Click listener */}
        {interactive && <MapEventsHandler onMapClick={handleMapClick} />}

        {/* Display issues markers */}
        {issues.map((issue) => (
          <Marker
            key={issue._id}
            position={[issue.latitude, issue.longitude]}
            icon={getMarkerIcon(issue.status)}
          >
            <Popup>
              <div className="p-1 font-sans flex flex-col gap-1 max-w-[220px]">
                <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-1 mb-1">
                  <span className="font-extrabold text-zinc-900 truncate">
                    {issue.title}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-650">
                    {issue.category}
                  </span>
                </div>
                {issue.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getImageUrl(issue.imageUrl)}
                    alt={issue.title}
                    className="w-full h-24 object-cover rounded-lg my-1"
                  />
                )}
                <p className="text-[11px] text-zinc-550 line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>
                <div className="text-[10px] text-zinc-400 mt-1 truncate">
                  {issue.address}
                </div>
                {onViewIssueDetails && (
                  <button
                    onClick={() => onViewIssueDetails(issue)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 text-left mt-2 flex items-center gap-0.5"
                  >
                    View Full Details &rarr;
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Interactive selection marker */}
        {interactive && selectedLocation && (
          <Marker position={selectedLocation} icon={getMarkerIcon("select")}>
            <Popup>
              <span className="text-xs font-bold text-blue-600">Selected Location Pin</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
