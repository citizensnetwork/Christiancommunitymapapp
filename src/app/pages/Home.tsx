import { useState, useRef } from 'react';
import { Search, SlidersHorizontal, Lightbulb, X, Settings, Crown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import MapLibreMap, { MapPin } from '../components/map/MapLibreMap';
import EventPreviewPanel from '../components/EventPreviewPanel';
import CategoryPanel from '../components/CategoryPanel';
import ProfilePanel from '../components/layout/ProfilePanel';
import { EVENT_CATEGORIES, getEventCategory, getPlaceCategory, LEGACY_CATEGORY_MAP } from '../data/categories';
import { useMapData } from '../hooks/useMapData';
import { impactIdeas, events as mockEvents, places as mockPlaces } from '../data/mock-data';
import { useUser } from '../context/UserContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, role } = useUser();
  const { events: serverEvents, places: serverPlaces, loading } = useMapData();

  // Fall back to local mock data if server hasn't returned data yet
  const liveEvents = serverEvents.length > 0 ? serverEvents : mockEvents.map(e => ({
    ...e, lng: e.mapX ? 28.00 + (e.mapX / 100) * 0.12 : 28.0473, lat: e.mapY ? -26.24 + (e.mapY / 100) * 0.07 : -26.2041,
    endTime: e.endTime ?? '', organizerName: e.organizerName ?? '', tags: e.tags ?? [],
    upcomingDates: e.upcomingDates ?? [], broadcastMessage: e.broadcastMessage ?? null,
  }));
  const livePlaces = serverPlaces.length > 0 ? serverPlaces : mockPlaces.map(p => ({
    ...p, lng: p.mapX ? 28.00 + (p.mapX / 100) * 0.12 : 28.0473, lat: p.mapY ? -26.24 + (p.mapY / 100) * 0.07 : -26.2041,
    openHours: p.openHours ?? '', description: p.description ?? '', organizerName: p.organizerName ?? '',
    associatedEventIds: p.associatedEventIds ?? [],
  }));

  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [selectedPinType, setSelectedPinType] = useState<'event' | 'place' | 'idea'>('event');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  const pillsRef = useRef<HTMLDivElement>(null);

  // Build map pins from server data (with local fallback)
  const eventPins: MapPin[] = liveEvents.map(e => ({
    id: e.id, type: 'event', title: e.title, category: e.category,
    lng: e.lng, lat: e.lat, isLive: e.isLive, isBusy: e.isBusy,
    broadcastMessage: e.broadcastMessage,
  }));
  const placePins: MapPin[] = livePlaces.map(p => ({
    id: p.id, type: 'place', title: p.name, category: p.category,
    lng: p.lng, lat: p.lat,
  }));
  const ideaPins: MapPin[] = showIdeas
    ? impactIdeas.filter(i => i.status === 'voting').map(i => ({
        id: i.id, type: 'idea', title: i.title, category: i.category,
        lng: (28.03 + Math.random() * 0.05), lat: (-26.22 + Math.random() * 0.03),
      }))
    : [];

  const allPins: MapPin[] = [...eventPins, ...placePins, ...ideaPins];

  const handlePinClick = (id: string, type: 'event' | 'place' | 'idea') => {
    setSelectedPin(prev => prev === id ? null : id);
    setSelectedPinType(type);
  };

  const scrollPills = (dir: 'left' | 'right') => {
    if (!pillsRef.current) return;
    pillsRef.current.scrollBy({ left: dir === 'left' ? -180 : 180, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{ height: '100%' }}>
      {/* Full-screen map */}
      <div className="absolute inset-0" onClick={() => setSelectedPin(null)}>
        <MapLibreMap
          pins={allPins}
          filterCategory={filterCategory}
          selectedPin={selectedPin}
          onPinClick={handlePinClick}
        />
      </div>

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-3 flex gap-2 items-center">
        {/* Search */}
        <div className={`flex-1 glass rounded-2xl shadow-xl border transition-all ${
          searchFocused ? 'border-[#C9A84C]/50 shadow-[0_0_0_3px_rgba(201,168,76,0.1)]' : 'border-white/60'
        }`}>
          <div className="flex items-center gap-2 px-4 py-3">
            <Search size={15} className="text-[#C9A84C] shrink-0" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search events, places, people…"
              className="flex-1 text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X size={13} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Filter */}
        <button
          onClick={() => setShowCategories(true)}
          className={`w-11 h-11 glass rounded-2xl shadow-xl border flex items-center justify-center shrink-0 transition-all ${
            filterCategory ? 'border-[#C9A84C]/60 bg-[#C9A84C]/10' : 'border-white/60'
          }`}
        >
          <SlidersHorizontal size={16} className={filterCategory ? 'text-[#C9A84C]' : 'text-foreground/60'} />
        </button>

        {/* Profile avatar (mobile + top-bar) */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowProfilePanel(s => !s)}
            className="w-11 h-11 glass rounded-2xl shadow-xl border border-white/60 overflow-hidden relative"
          >
            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
            {role !== 'citizen' && (
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#C9A84C] border-2 border-white flex items-center justify-center">
                <Crown size={7} className="text-white" />
              </span>
            )}
          </button>
          {showProfilePanel && (
            <ProfilePanel onClose={() => setShowProfilePanel(false)} anchor="top" />
          )}
        </div>
      </div>

      {/* ── Scrollable category pills ─────────────────────────────── */}
      <div className="absolute top-[72px] left-0 right-0 z-20 flex items-center gap-1 px-2">
        {/* Left scroll arrow */}
        <button
          onClick={() => scrollPills('left')}
          className="glass w-7 h-7 rounded-full border border-white/60 flex items-center justify-center shadow-md shrink-0"
        >
          <ChevronLeft size={13} className="text-foreground/60" />
        </button>

        {/* Pill strip */}
        <div
          ref={pillsRef}
          className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* All / clear */}
          <button
            onClick={() => setFilterCategory(null)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shadow-sm shrink-0 ${
              !filterCategory
                ? 'bg-foreground text-background'
                : 'glass text-foreground/60 border border-white/60'
            }`}
          >
            All
          </button>

          {EVENT_CATEGORIES.map(cat => {
            const { Icon } = cat;
            const isActive = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(isActive ? null : cat.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shadow-sm shrink-0"
                style={
                  isActive
                    ? { background: cat.hex, color: '#fff', boxShadow: `0 3px 12px ${cat.hex}55` }
                    : { background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', color: cat.hex, border: `1px solid ${cat.hex}40` }
                }
              >
                <Icon size={11} strokeWidth={2.5} />
                {cat.short}
              </button>
            );
          })}

          {/* Ideas toggle */}
          <button
            onClick={() => setShowIdeas(s => !s)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shadow-sm shrink-0 ${
              showIdeas
                ? 'bg-[#C9A84C] text-white'
                : 'glass text-[#C9A84C] border border-[#C9A84C]/40'
            }`}
          >
            <Lightbulb size={11} strokeWidth={2.5} />
            Ideas
          </button>
        </div>

        {/* Right scroll arrow */}
        <button
          onClick={() => scrollPills('right')}
          className="glass w-7 h-7 rounded-full border border-white/60 flex items-center justify-center shadow-md shrink-0"
        >
          <ChevronRight size={13} className="text-foreground/60" />
        </button>
      </div>

      {/* Active filter pill (centre) */}
      {filterCategory && (() => {
        const cat = getEventCategory(filterCategory);
        return cat ? (
          <div className="absolute top-[120px] left-1/2 -translate-x-1/2 z-20 fade-in">
            <div className="glass px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/60">
              <span className="text-xs font-semibold text-foreground">{cat.name}</span>
              <button onClick={() => setFilterCategory(null)}>
                <X size={11} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        ) : null;
      })()}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-[120px] left-1/2 -translate-x-1/2 z-20">
          <div className="glass px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/60">
            <div className="w-3 h-3 border border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-semibold text-muted-foreground">Loading map data…</span>
          </div>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute bottom-32 left-3 z-20 md:bottom-6">
        <div className="glass rounded-xl p-2.5 border border-white/60 shadow-lg space-y-1.5">
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Map Key</p>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 relative flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-50" />
            </span>
            <span className="text-[10px] text-foreground/70">Live</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border border-foreground/30 bg-white/70" />
            <span className="text-[10px] text-foreground/70">Place</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border border-[#C9A84C]/60 bg-[#F2E8CC]" />
            <span className="text-[10px] text-foreground/70">Idea</span>
          </div>
        </div>
      </div>

      {/* Event preview panel */}
      {selectedPin && (
        <EventPreviewPanel id={selectedPin} type={selectedPinType} onClose={() => setSelectedPin(null)} />
      )}

      {/* Category panel overlay */}
      {showCategories && (
        <CategoryPanel
          onSelect={(id) => setFilterCategory(id || null)}
          onClose={() => setShowCategories(false)}
          selected={filterCategory}
        />
      )}
    </div>
  );
}
