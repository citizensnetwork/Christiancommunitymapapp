import { useState, useRef, useEffect } from 'react';
import { events, places, impactIdeas, categories } from '../../data/mock-data';
import EventPin from './EventPin';

interface KingdomMapProps {
  filterCategory: string | null;
  onPinClick: (id: string, type: 'event' | 'place' | 'idea') => void;
  selectedPin: string | null;
  showIdeas: boolean;
}

export default function KingdomMap({ filterCategory, onPinClick, selectedPin, showIdeas }: KingdomMapProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const filteredEvents = filterCategory
    ? events.filter(e => e.category === filterCategory)
    : events;

  const filteredPlaces = filterCategory
    ? places.filter(p => p.category === filterCategory)
    : places;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(2, Math.max(0.6, prev - e.deltaY * 0.001)));
  };

  return (
    <div
      ref={mapRef}
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Map background */}
      <div
        className="absolute inset-[-20%] transition-transform"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Base map tile */}
        <div className="absolute inset-0" style={{
          background: '#E8E0CC',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.75) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,0.75) 2px, transparent 2px),
            linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)
          `,
          backgroundSize: '140px 140px, 140px 140px, 35px 35px, 35px 35px',
        }} />

        {/* Park areas */}
        <div className="absolute rounded-3xl opacity-60" style={{ background: '#B8D4A8', left: '15%', top: '55%', width: '12%', height: '18%', transform: 'rotate(-8deg)' }} />
        <div className="absolute rounded-2xl opacity-50" style={{ background: '#C4DEB8', left: '72%', top: '62%', width: '9%', height: '14%', transform: 'rotate(5deg)' }} />
        <div className="absolute rounded-full opacity-40" style={{ background: '#AACCA0', left: '45%', top: '72%', width: '7%', height: '10%' }} />

        {/* Water body */}
        <div className="absolute opacity-70" style={{
          background: 'linear-gradient(135deg, #A8C4D8 0%, #B8D4E8 100%)',
          left: '58%', top: '10%', width: '18%', height: '22%',
          borderRadius: '60% 40% 50% 45% / 45% 55% 40% 50%',
        }} />
        <div className="absolute opacity-50" style={{
          background: '#A8C4D8',
          left: '74%', top: '28%', width: '3%', height: '8%',
          borderRadius: '40%',
        }} />

        {/* Major road highlights */}
        <div className="absolute opacity-80" style={{ background: 'rgba(255,255,255,0.9)', left: '0', top: '37%', width: '100%', height: '4px' }} />
        <div className="absolute opacity-80" style={{ background: 'rgba(255,255,255,0.9)', left: '40%', top: '0', width: '4px', height: '100%' }} />
        <div className="absolute opacity-60" style={{ background: 'rgba(255,255,255,0.7)', left: '0', top: '60%', width: '100%', height: '2px' }} />
        <div className="absolute opacity-60" style={{ background: 'rgba(255,255,255,0.7)', left: '65%', top: '0', width: '2px', height: '100%' }} />

        {/* Diagonal road */}
        <div className="absolute opacity-50" style={{
          background: 'rgba(255,255,255,0.7)',
          left: '20%', top: '20%', width: '50%', height: '2px',
          transform: 'rotate(25deg)',
          transformOrigin: 'left center',
        }} />

        {/* Block labels */}
        {[
          { text: 'Jubilee Quarter', x: '36%', y: '28%' },
          { text: 'Southside', x: '62%', y: '20%' },
          { text: 'Creative Quarter', x: '18%', y: '52%' },
          { text: 'New Jerusalem District', x: '52%', y: '47%' },
          { text: 'Central District', x: '40%', y: '14%' },
        ].map(label => (
          <div key={label.text} className="absolute text-[9px] font-semibold uppercase tracking-widest text-[#8B7A5C]/60 pointer-events-none"
            style={{ left: label.x, top: label.y, transform: 'translate(-50%, -50%)' }}>
            {label.text}
          </div>
        ))}

        {/* Event pins */}
        {filteredEvents.map(event => (
          <EventPin
            key={event.id}
            event={event}
            type="event"
            isSelected={selectedPin === event.id}
            onClick={() => onPinClick(event.id, 'event')}
          />
        ))}

        {/* Place pins */}
        {filteredPlaces.map(place => (
          <EventPin
            key={place.id}
            event={{ ...place, isLive: false, isBusy: false } as any}
            type="place"
            isSelected={selectedPin === place.id}
            onClick={() => onPinClick(place.id, 'place')}
          />
        ))}

        {/* Impact Idea voting polls */}
        {showIdeas && impactIdeas.filter(i => i.status === 'voting').map(idea => (
          <EventPin
            key={idea.id}
            event={{ ...idea, category: idea.category, isLive: false, isBusy: false } as any}
            type="idea"
            isSelected={selectedPin === idea.id}
            onClick={() => onPinClick(idea.id, 'idea')}
          />
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-32 right-4 flex flex-col gap-1 z-20 md:bottom-8">
        <button onClick={() => setZoom(z => Math.min(2, z + 0.15))}
          className="glass w-9 h-9 rounded-xl flex items-center justify-center text-foreground/70 hover:text-foreground shadow-lg font-bold text-lg transition-all">
          +
        </button>
        <button onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
          className="glass w-9 h-9 rounded-xl flex items-center justify-center text-foreground/70 hover:text-foreground shadow-lg font-bold text-xl transition-all">
          −
        </button>
      </div>
    </div>
  );
}
