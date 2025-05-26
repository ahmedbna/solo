'use client';

import React, { useEffect, useRef } from 'react';
import { Location } from '@/lib/types';

interface MapboxMapProps {
  locations: Location[];
  height?: string;
  onClick?: (latitude: number, longitude: number) => void;
  interactive?: boolean;
}

export function MapboxMap({
  locations,
  height = '400px',
  onClick,
  interactive = false,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    // Mock Mapbox implementation - in real app, use actual Mapbox GL JS
    if (!mapContainer.current) return;

    // Simulate map initialization
    const mockMap = {
      setView: (center: [number, number], zoom: number) => {
        console.log(`Map centered at ${center} with zoom ${zoom}`);
      },
      addMarkers: (locations: Location[]) => {
        console.log(`Added ${locations.length} markers`);
      },
      onClick: (callback: (lat: number, lng: number) => void) => {
        if (interactive && onClick) {
          // Add click handler
          mapContainer.current?.addEventListener('click', (e) => {
            const rect = mapContainer.current!.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Mock coordinate conversion
            const lat = 40.7128 + (y / rect.height - 0.5) * 20;
            const lng = -74.006 + (x / rect.width - 0.5) * 40;

            callback(lat, lng);
          });
        }
      },
    };

    map.current = mockMap;

    // Set initial view
    if (locations.length > 0) {
      const centerLat =
        locations.reduce((sum, loc) => sum + loc.latitude, 0) /
        locations.length;
      const centerLng =
        locations.reduce((sum, loc) => sum + loc.longitude, 0) /
        locations.length;
      mockMap.setView([centerLat, centerLng], 10);
    } else {
      mockMap.setView([40.7128, -74.006], 2);
    }

    mockMap.addMarkers(locations);
    mockMap.onClick(onClick || (() => {}));
  }, [locations, onClick, interactive]);

  return (
    <div
      ref={mapContainer}
      style={{ height }}
      className='relative bg-gray-100 rounded-lg border border-gray-200 overflow-hidden'
    >
      {/* Mock map display */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center'>
        <div className='text-center space-y-2'>
          <div className='text-lg font-medium text-gray-700'>
            Interactive Map
          </div>
          <div className='text-sm text-gray-500'>
            {locations.length > 0 ? (
              <div>
                Showing {locations.length} location
                {locations.length !== 1 ? 's' : ''}
                <div className='mt-2 space-y-1'>
                  {locations.map((loc, index) => (
                    <div
                      key={loc.id}
                      className='text-xs bg-white bg-opacity-80 rounded px-2 py-1'
                    >
                      📍 {loc.city}, {loc.country}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              'No locations to display'
            )}
          </div>
          {interactive && (
            <div className='text-xs text-blue-600 mt-2'>
              Click to select coordinates
            </div>
          )}
        </div>
      </div>

      {/* Mapbox integration note */}
      <div className='absolute bottom-2 right-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded'>
        Mapbox GL JS
      </div>
    </div>
  );
}
