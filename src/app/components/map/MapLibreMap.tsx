import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getEventCategory, getPlaceCategory } from '../../data/categories';
import { LEGACY_CATEGORY_MAP } from '../../data/categories';

const MAPTILER_KEY = 'HazsK0vf8bZH1Bv1HPUz';
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

// Default centre — Johannesburg (can be updated dynamically)
const DEFAULT_CENTER: [number, number] = [28.0473, -26.2041];
const DEFAULT_ZOOM = 13;

export interface MapPin {
  id: string;
  type: 'event' | 'place' | 'idea';
  title: string;
  category: string;
  lng: number;
  lat: number;
  isLive?: boolean;
  isBusy?: boolean;
  broadcastMessage?: string | null;
}

interface MapLibreMapProps {
  pins: MapPin[];
  filterCategory: string | null;
  selectedPin: string | null;
  onPinClick: (id: string, type: MapPin['type']) => void;
  showIdeas?: boolean;
}

function resolveCategoryHex(category: string, type: MapPin['type']): string {
  const resolved = LEGACY_CATEGORY_MAP[category] || category;
  if (type === 'place') return getPlaceCategory(resolved)?.hex ?? '#C9A84C';
  if (type === 'idea') return '#C9A84C';
  return getEventCategory(resolved)?.hex ?? '#0A0908';
}

function createMarkerEl(pin: MapPin, isSelected: boolean): HTMLElement {
  const hex = resolveCategoryHex(pin.category, pin.type);
  const size = pin.type === 'event' ? 42 : 34;
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `position:relative;width:${size}px;height:${size + 12}px;cursor:pointer;`;

  // Pulse ring for live events
  if (pin.isLive || pin.isBusy) {
    const pulse = document.createElement('div');
    pulse.style.cssText = `
      position:absolute;inset:2px;border-radius:50%;background:${hex};
      opacity:0.25;animation:mapPulse 1.8s ease-out infinite;
    `;
    wrapper.appendChild(pulse);
  }

  // Main circle
  const circle = document.createElement('div');
  circle.style.cssText = `
    position:absolute;top:0;left:50%;transform:translateX(-50%);
    width:${size}px;height:${size}px;border-radius:50%;
    background:${isSelected ? hex : 'rgba(255,255,255,0.92)'};
    border:2.5px solid ${hex};
    box-shadow:0 4px 16px ${hex}55;
    display:flex;align-items:center;justify-content:center;
    transition:all 0.2s;
  `;

  // Dot inside
  const dot = document.createElement('div');
  dot.style.cssText = `
    width:${isSelected ? size * 0.38 : size * 0.32}px;
    height:${isSelected ? size * 0.38 : size * 0.32}px;
    border-radius:50%;
    background:${isSelected ? 'rgba(255,255,255,0.9)' : hex};
  `;
  circle.appendChild(dot);

  // Live badge
  if (pin.isLive) {
    const live = document.createElement('div');
    live.style.cssText = `
      position:absolute;top:-2px;right:-2px;width:10px;height:10px;
      border-radius:50%;background:#ef4444;border:2px solid white;
    `;
    circle.appendChild(live);
  }

  // Broadcast bubble
  if (pin.broadcastMessage) {
    const bubble = document.createElement('div');
    bubble.style.cssText = `
      position:absolute;bottom:${size + 2}px;left:50%;transform:translateX(-50%);
      background:rgba(255,255,255,0.9);backdrop-filter:blur(8px);
      border:1px solid rgba(201,168,76,0.35);border-radius:20px;
      padding:2px 7px;font-size:9px;font-weight:700;white-space:nowrap;
      box-shadow:0 2px 8px rgba(0,0,0,0.12);
      animation:mapBubble 0.9s ease-in-out infinite alternate;
    `;
    bubble.textContent = '💬';
    wrapper.appendChild(bubble);
  }

  // Stem
  const stem = document.createElement('div');
  stem.style.cssText = `
    position:absolute;bottom:0;left:50%;transform:translateX(-50%);
    width:3px;height:12px;
    background:linear-gradient(to bottom, ${hex}, ${hex}00);
    border-radius:0 0 2px 2px;
  `;

  wrapper.appendChild(circle);
  wrapper.appendChild(stem);
  return wrapper;
}

// Inject keyframes once
let keyframesInjected = false;
function injectKeyframes() {
  if (keyframesInjected) return;
  keyframesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes mapPulse {
      0% { transform: scale(1); opacity: 0.25; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    @keyframes mapBubble {
      from { transform: translateX(-50%) translateY(0); }
      to { transform: translateX(-50%) translateY(-4px); }
    }
    .maplibregl-canvas { border-radius: 0; }
    .maplibregl-ctrl-bottom-right { display: none; }
    .maplibregl-ctrl-bottom-left { bottom: 80px !important; }
    .maplibregl-ctrl-top-right { top: 100px !important; right: 12px !important; }
  `;
  document.head.appendChild(style);
}

export default function MapLibreMap({
  pins,
  filterCategory,
  selectedPin,
  onPinClick,
}: MapLibreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, { marker: maplibregl.Marker; pin: MapPin }>>({});
  const [mapReady, setMapReady] = useState(false);

  injectKeyframes();

  const visiblePins = filterCategory
    ? pins.filter(p => {
        const resolved = LEGACY_CATEGORY_MAP[p.category] || p.category;
        return resolved === filterCategory || p.category === filterCategory;
      })
    : pins;

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.on('load', () => {
      setMapReady(true);
    });

    mapRef.current = map;

    return () => {
      Object.values(markersRef.current).forEach(({ marker }) => marker.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync markers whenever pins / filter / selection changes
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const visibleIds = new Set(visiblePins.map(p => p.id));

    // Remove markers no longer visible
    Object.keys(markersRef.current).forEach(id => {
      if (!visibleIds.has(id)) {
        markersRef.current[id].marker.remove();
        delete markersRef.current[id];
      }
    });

    // Add / update markers
    visiblePins.forEach(pin => {
      const isSelected = selectedPin === pin.id;

      if (markersRef.current[pin.id]) {
        // Rebuild element on selection change
        const { marker } = markersRef.current[pin.id];
        const el = createMarkerEl(pin, isSelected);
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onPinClick(pin.id, pin.type);
        });
        marker.getElement().replaceWith(el);
        // maplibre marker element reference is internal — rebuild instead
        markersRef.current[pin.id].marker.remove();
        const newMarker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([pin.lng, pin.lat])
          .addTo(mapRef.current!);
        markersRef.current[pin.id] = { marker: newMarker, pin };
      } else {
        const el = createMarkerEl(pin, isSelected);
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onPinClick(pin.id, pin.type);
        });
        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([pin.lng, pin.lat])
          .addTo(mapRef.current!);
        markersRef.current[pin.id] = { marker, pin };
      }
    });

    // Fly to selected pin
    if (selectedPin && markersRef.current[selectedPin]) {
      const { pin } = markersRef.current[selectedPin];
      mapRef.current.flyTo({ center: [pin.lng, pin.lat], zoom: Math.max(mapRef.current.getZoom(), 14), duration: 500 });
    }
  }, [visiblePins, selectedPin, mapReady, onPinClick]);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="w-full h-full" />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#EDE5D4]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
            <p className="text-xs font-semibold text-[#8B6914]">Loading map…</p>
          </div>
        </div>
      )}
    </div>
  );
}
