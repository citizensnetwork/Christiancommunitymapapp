import { useState } from 'react';
import { ArrowLeft, Camera, Bell, Eye, User, Lock, Globe, ChevronRight, Check, Crown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { currentUser, categories } from '../data/mock-data';

const QUICK_FILTER_IDS = ['worship', 'prayer', 'youth', 'outreach', 'community'];

export default function Settings() {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(currentUser.isPublic);
  const [notifPrefs, setNotifPrefs] = useState(currentUser.notifPreferences);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [interests, setInterests] = useState<string[]>(['worship', 'youth', 'outreach']);
  const [quickFilters, setQuickFilters] = useState<string[]>(['worship', 'prayer', 'youth', 'outreach', 'community']);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (id: string) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleQuickFilter = (id: string) => {
    setQuickFilters(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border glass flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center md:hidden">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Settings</h2>
          <p className="text-xs text-muted-foreground">Your Citizen Profile & Preferences</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        {/* Profile section */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Profile</p>

          {/* Avatar & cover */}
          <div className="relative mb-6">
            <div className="h-24 rounded-2xl overflow-hidden">
              <img src={currentUser.coverPhoto} alt="" className="w-full h-full object-cover" />
              <button className="absolute top-2 right-2 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                <Camera size={12} />
              </button>
            </div>
            <div className="absolute -bottom-5 left-4">
              <div className="relative">
                <img src={currentUser.profilePhoto} alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-background shadow-lg" />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#C9A84C] rounded-full flex items-center justify-center shadow">
                  <Camera size={10} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Display Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:border-[#C9A84C]/60 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Privacy</p>
          <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                {isPublic ? <Globe size={16} className="text-[#C9A84C]" /> : <Lock size={16} className="text-muted-foreground" />}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{isPublic ? 'Public Profile' : 'Private Profile'}</p>
                <p className="text-xs text-muted-foreground">{isPublic ? 'Discoverable by all citizens' : 'Only visible to friends'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isPublic ? 'bg-[#C9A84C]' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${isPublic ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Notifications</p>
          <div className="space-y-3">
            {Object.entries(notifPrefs).map(([key, value]) => {
              const labels: Record<string, { label: string; desc: string }> = {
                events: { label: 'Event Updates', desc: 'New events matching your interests' },
                messages: { label: 'Messages', desc: 'Direct messages and replies' },
                broadcasts: { label: 'Broadcasts', desc: 'Organiser updates for events you follow' },
                friends: { label: 'Friends', desc: 'Friend requests and activity' },
              };
              return (
                <div key={key} className="flex items-center justify-between p-3.5 bg-card rounded-xl border border-border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{labels[key]?.label}</p>
                    <p className="text-xs text-muted-foreground">{labels[key]?.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                    className={`w-11 h-6 rounded-full transition-all duration-300 relative ${value ? 'bg-[#C9A84C]' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${value ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Interests</p>
          <p className="text-xs text-muted-foreground mb-4">We'll use these to personalise your map layers</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const selected = interests.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleInterest(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all border"
                  style={selected ? { background: cat.color, color: '#fff', border: `1px solid ${cat.color}` } : { background: cat.bg, color: cat.color, border: `1px solid ${cat.color}40` }}
                >
                  {selected && <Check size={10} />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick filters */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Quick Filters</p>
          <p className="text-xs text-muted-foreground mb-4">Choose up to 5 categories to show as quick filters on the home screen</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const selected = quickFilters.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleQuickFilter(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all border"
                  style={selected ? { background: cat.color, color: '#fff', border: `1px solid ${cat.color}` } : { background: '#fff', color: '#7A7060', border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  {cat.name}
                  {selected && <Check size={10} />}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{quickFilters.length}/5 selected</p>
        </div>

        {/* Weekly contribution */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Weekly Contribution</p>
          <div className="bg-gradient-to-br from-[#F2E8CC] to-[#E8D48B]/30 rounded-2xl p-4 border border-[#C9A84C]/30">
            <div className="flex items-center gap-3 mb-2">
              <Crown size={18} className="text-[#C9A84C]" />
              <p className="text-sm font-bold text-[#8B6914]">Community-Organised Event</p>
            </div>
            <p className="text-xs text-[#8B6914]/80 leading-relaxed mb-3">
              As a Citizen, you can post 1 community-organised event per week with the Community-Organised badge. Want to post more? Apply to become a Contributor.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-[#C9A84C] text-white rounded-xl text-xs font-bold hover:bg-[#8B6914] transition-colors">
                Post This Week's Event
              </button>
              <button className="flex-1 py-2.5 border border-[#C9A84C]/40 text-[#8B6914] rounded-xl text-xs font-bold hover:bg-[#F2E8CC] transition-colors">
                Apply as Contributor
              </button>
            </div>
          </div>
        </div>

        {/* Profile sharing */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Profile Sharing</p>
          <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
            <img src={currentUser.profilePhoto} alt="" className="w-10 h-10 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">kingdom.connect/u/{currentUser.id}</p>
            </div>
            <button className="px-3 py-2 bg-muted rounded-lg text-xs font-bold text-foreground hover:bg-muted/70 transition-colors">
              Share
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="px-5 py-5">
          <button onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${
              saved ? 'bg-green-500 text-white' : 'bg-foreground text-background hover:bg-foreground/90'
            }`}
          >
            {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
