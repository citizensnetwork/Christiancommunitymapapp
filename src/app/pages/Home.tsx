import { useState } from 'react';
import { Search, SlidersHorizontal, Lightbulb, Music, Hand, Star, Heart, Users, X, Crown, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import KingdomMap from '../components/map/KingdomMap';
import EventPreviewPanel from '../components/EventPreviewPanel';
import CategoryPanel from '../components/CategoryPanel';
import { categories, currentUser } from '../data/mock-data';

const quickFilterIcons: Record<string, React.ElementType> = {
  Music, Hand, Star, Heart, Users,
};

const QUICK_FILTER_IDS = ['worship', 'prayer', 'youth', 'outreach', 'community'];

export default function Home() {
  const navigate = useNavigate();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [selectedPinType, setSelectedPinType] = useState<'event' | 'place' | 'idea'>('event');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handlePinClick = (id: string, type: 'event' | 'place' | 'idea') => {
    if (selectedPin === id) {
      setSelectedPin(null);
    } else {
      setSelectedPin(id);
      setSelectedPinType(type);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{ height: '100%' }}>
      {/* Full-screen map */}
      <div className="absolute inset-0" onClick={() => setSelectedPin(null)}>
        <KingdomMap
          filterCategory={filterCategory}
          onPinClick={handlePinClick}
          selectedPin={selectedPin}
          showIdeas={showIdeas}
        />
      </div>

      {/* Top search bar & controls */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-4 flex gap-2 items-start">
        {/* Search */}
        <div className={`flex-1 glass rounded-2xl shadow-xl border transition-all ${searchFocused ? 'border-[#C9A84C]/50 shadow-[0_0_0_3px_rgba(201,168,76,0.12)]' : 'border-white/60'}`}>
          <div className="flex items-center gap-2 px-4 py-3">
            <Search size={16} className="text-[#C9A84C] shrink-0" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search events, places, people..."
              className="flex-1 text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowCategories(true)}
          className={`w-12 h-12 glass rounded-2xl shadow-xl border flex items-center justify-center transition-all ${filterCategory ? 'border-[#C9A84C]/60 bg-[#C9A84C]/10' : 'border-white/60'}`}
        >
          <SlidersHorizontal size={17} className={filterCategory ? 'text-[#C9A84C]' : 'text-foreground/60'} />
        </button>

        {/* User avatar */}
        <button
          onClick={() => navigate(`/profile/${currentUser.id}`)}
          className="w-12 h-12 glass rounded-2xl shadow-xl border border-white/60 overflow-hidden"
        >
          <img src={currentUser.profilePhoto} alt={currentUser.name} className="w-full h-full object-cover" />
        </button>
      </div>

      {/* Quick filters */}
      <div className="absolute top-20 left-4 right-4 z-20 flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {QUICK_FILTER_IDS.map(catId => {
          const cat = categories.find(c => c.id === catId)!;
          const Icon = quickFilterIcons[cat.icon] || Music;
          const isActive = filterCategory === catId;
          return (
            <button
              key={catId}
              onClick={() => setFilterCategory(isActive ? null : catId)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-lg ${
                isActive ? 'text-white shadow-xl scale-105' : 'glass text-foreground/70 border border-white/60'
              }`}
              style={isActive ? { background: cat.color } : {}}
            >
              <Icon size={12} strokeWidth={2.5} />
              {cat.name}
            </button>
          );
        })}

        {/* Ideas toggle */}
        <button
          onClick={() => setShowIdeas(!showIdeas)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-lg ${
            showIdeas ? 'bg-[#C9A84C] text-white shadow-xl scale-105' : 'glass text-foreground/70 border border-white/60'
          }`}
        >
          <Lightbulb size={12} strokeWidth={2.5} />
          Ideas
        </button>
      </div>

      {/* Active filter indicator */}
      {filterCategory && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20 fade-in">
          <div className="glass px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/60">
            <span className="text-xs font-semibold text-foreground">
              Filtered: {categories.find(c => c.id === filterCategory)?.name}
            </span>
            <button onClick={() => setFilterCategory(null)} className="text-muted-foreground hover:text-foreground">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute bottom-32 left-4 z-20 md:bottom-8">
        <div className="glass rounded-xl p-3 border border-white/60 shadow-lg space-y-1.5">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Map Key</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 relative">
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
            </span>
            <span className="text-[10px] text-foreground/70">Live Event</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xl bg-[#0A0908]" />
            <span className="text-[10px] text-foreground/70">Place</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-[#C9A84C]" />
            <span className="text-[10px] text-foreground/70">Impact Idea</span>
          </div>
        </div>
      </div>

      {/* Event preview panel */}
      {selectedPin && (
        <EventPreviewPanel
          id={selectedPin}
          type={selectedPinType}
          onClose={() => setSelectedPin(null)}
        />
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
