import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Case, RabiesFlag, Animal } from '../../types';

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  cases?: Case[];
  rabiesFlags?: RabiesFlag[];
  animals?: Animal[];
  onSelectCase?: (caseId: string) => void;
  onSelectAnimal?: (tagId: string) => void;
  height?: string;
  allowPinDrop?: boolean;
  onPinDropped?: (lat: number, lng: number) => void;
  selectedPin?: [number, number] | null;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [17.4410, 78.3520], // Default Hyderabad Gachibowli
  zoom = 14,
  cases = [],
  rabiesFlags = [],
  animals = [],
  onSelectCase,
  onSelectAnimal,
  height = '400px',
  allowPinDrop = false,
  onPinDropped,
  selectedPin
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const droppedPinMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      if (allowPinDrop) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          if (onPinDropped) {
            onPinDropped(e.latlng.lat, e.latlng.lng);
          }
        });
      }
    }

    return () => {
      // Keep map instance alive across rerenders
    };
  }, []);

  // Update center if props change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;
    markersLayer.clearLayers();

    // 1. Cases
    cases.forEach((c) => {
      let iconColor = '#0f766e'; // teal
      if (c.urgency === 'injured_now') iconColor = '#e11d48'; // red
      if (c.urgency === 'sick_limping') iconColor = '#f59e0b'; // amber

      const customIcon = L.divIcon({
        className: 'custom-case-marker',
        html: `
          <div style="background-color: ${iconColor}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">
            🐾
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([c.lat, c.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-xs';
      popupContent.innerHTML = `
        <div style="font-weight: 600; font-size: 13px; margin-bottom: 2px;">${c.approxArea}</div>
        <div style="color: #64748b; margin-bottom: 4px;">Status: <strong>${c.state.toUpperCase()}</strong> · Urgency: ${c.urgency}</div>
        <button id="btn-case-${c.id}" style="background-color: #0f766e; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; width: 100%;">
          View Case #${c.id.substring(0, 8)}
        </button>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-case-${c.id}`);
        if (btn && onSelectCase) {
          btn.onclick = () => onSelectCase(c.id);
        }
      });

      // Approximate privacy circle as required by PRD FR-8 & Section 10
      L.circle([c.lat, c.lng], {
        radius: 180,
        color: iconColor,
        fillColor: iconColor,
        fillOpacity: 0.1,
        weight: 1
      }).addTo(markersLayer);

      marker.addTo(markersLayer);
    });

    // 2. Rabies Flags (Vet-set suspected rabies only, PRD FR-24 - FR-27: static marker, no dangerous labeling)
    rabiesFlags.forEach((flag) => {
      const rabiesIcon = L.divIcon({
        className: 'custom-rabies-marker',
        html: `
          <div style="background-color: #7f1d1d; width: 30px; height: 30px; border-radius: 6px; border: 2px solid #fecaca; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
            ⚠️
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([flag.lat, flag.lng], { icon: rabiesIcon });
      const dateStr = new Date(flag.setAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; max-width: 200px;">
          <div style="color: #991b1b; font-weight: 700; margin-bottom: 2px;">Suspected Rabies Observation</div>
          <div style="color: #334155; margin-bottom: 4px;"><strong>Location:</strong> ${flag.areaName}</div>
          <div style="color: #475569; font-size: 11px; margin-bottom: 2px;"><strong>Confirmed by:</strong> ${flag.clinicName}</div>
          <div style="color: #64748b; font-size: 10px;"><strong>Date:</strong> ${dateStr}</div>
          <div style="margin-top: 6px; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            <em>Information only. Keep distance. Report sightings directly to local municipal authorities.</em>
          </div>
        </div>
      `);

      marker.addTo(markersLayer);
    });

    // 3. Animal Tag Markers
    animals.forEach((animal) => {
      const animalIcon = L.divIcon({
        className: 'custom-animal-marker',
        html: `
          <div style="background-color: #2563eb; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
            🏷️
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([animal.lastKnownLat, animal.lastKnownLng], { icon: animalIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-xs';
      popupContent.innerHTML = `
        <div style="font-weight: 700; font-size: 13px;">Tag: ${animal.tagId}</div>
        <div style="color: #475569; margin-bottom: 4px;">${animal.breedNote}</div>
        <div style="color: #16a34a; font-weight: 600; font-size: 11px; margin-bottom: 6px;">
          ${animal.vaccinated ? '✓ Vaccinated' : 'Vaccination Pending'}
        </div>
        <button id="btn-animal-${animal.tagId}" style="background-color: #2563eb; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; width: 100%;">
          View QR Profile
        </button>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-animal-${animal.tagId}`);
        if (btn && onSelectAnimal) {
          btn.onclick = () => onSelectAnimal(animal.tagId);
        }
      });

      marker.addTo(markersLayer);
    });
  }, [cases, rabiesFlags, animals]);

  // Handle selected dropped pin
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (droppedPinMarkerRef.current) {
      mapInstanceRef.current.removeLayer(droppedPinMarkerRef.current);
      droppedPinMarkerRef.current = null;
    }

    if (selectedPin) {
      const pinIcon = L.divIcon({
        className: 'custom-drop-pin',
        html: `
          <div style="background-color: #0f766e; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; margin-top: -16px; margin-left: -16px;">
            <div style="transform: rotate(45deg); width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const pinMarker = L.marker(selectedPin, { icon: pinIcon }).addTo(mapInstanceRef.current);
      droppedPinMarkerRef.current = pinMarker;
    }
  }, [selectedPin]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      {allowPinDrop && (
        <div className="absolute top-2 right-2 z-10 rounded-md bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm border border-slate-200">
          Tap on map to reposition pin
        </div>
      )}
    </div>
  );
};
