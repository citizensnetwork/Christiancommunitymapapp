import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Share2, MessageCircle, Globe, Users, Heart, ChevronRight, Star, MapPin, Calendar, Mail, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { contributors, events, places, categories } from '../data/mock-data';

const involvementColors: Record<string, string> = {
  Beacon: '#C9A84C',
  Pillar: '#7C3AED',
  Shepherd: '#16A34A',
  Seed: '#2563EB',
};

export default function ContributorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contributor = contributors.find(c => c.id === id);
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'places' | 'team' | 'collabs'>('events');

  if (!contributor) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-muted-foreground">Profile not found</p>
    </div>
  );

  const cat = categories.find(c => c.id === contributor.category);
  const orgEvents = events.filter(e => e.organizerId === id);
  const orgPlaces = places.filter(p => p.organizerId === id);
  const collabOrgs = contributors.filter(c => contributor.collaborators.includes(c.id));
  const invLevel = contributor.involvementLevel;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Hero / Cover */}
      <div className="relative h-56 shrink-0 overflow-hidden">
        <img src={contributor.coverPhoto} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
          <ArrowLeft size={18} />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {/* Profile header */}
      <div className="px-5 pb-4 border-b border-border">
        <div className="flex items-end gap-4 -mt-10 mb-3">
          <img src={contributor.profilePhoto} alt={contributor.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-background shadow-xl shrink-0" />
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-foreground">{contributor.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0"
                style={{ background: involvementColors[invLevel] || '#C9A84C' }}>
                {invLevel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{contributor.dominantNiche}</p>
          </div>
        </div>

        {/* Category badge */}
        {cat && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
            style={{ background: cat.bg, color: cat.color }}>
            {cat.name}
          </span>
        )}

        <p className="text-sm text-foreground/80 leading-relaxed mb-4">{contributor.bio}</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-base font-bold text-foreground">{contributor.followerCount.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Followers</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-base font-bold text-foreground">{orgEvents.length}</p>
            <p className="text-[10px] text-muted-foreground">Events</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-base font-bold text-foreground">{orgPlaces.length}</p>
            <p className="text-[10px] text-muted-foreground">Places</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFollowed(!followed)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              followed ? 'bg-[#C9A84C] text-white' : 'bg-foreground text-background'
            }`}
          >
            <Heart size={15} fill={followed ? 'currentColor' : 'none'} />
            {followed ? 'Following' : 'Follow'}
          </button>
          <button onClick={() => navigate('/messages')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
            <MessageCircle size={15} /> Message
          </button>
          {contributor.website && (
            <a href={contributor.website} target="_blank" rel="noreferrer"
              className="w-12 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
              <Globe size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Tabs content */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        <div className="px-5 py-4">
          <div className="flex gap-0 bg-muted rounded-xl p-1 mb-4 overflow-x-auto">
            {(['events', 'places', 'team', 'collabs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all px-2 ${
                  activeTab === tab ? 'bg-white shadow text-foreground' : 'text-muted-foreground'
                }`}
              >
                {tab === 'collabs' ? 'Friends' : tab}
              </button>
            ))}
          </div>

          {activeTab === 'events' && (
            <div className="space-y-3 fade-in">
              {orgEvents.length > 0 ? orgEvents.map(event => (
                <button key={event.id} onClick={() => navigate(`/event/${event.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl border border-border hover:border-[#C9A84C]/40 transition-all text-left">
                  <img src={event.coverPhoto} alt={event.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground truncate">{event.title}</p>
                      {event.isLive && <span className="shrink-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {event.time}
                    </p>
                    <p className="text-xs text-[#C9A84C] font-semibold mt-0.5">{event.connectCount} connected</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </button>
              )) : <p className="text-sm text-muted-foreground text-center py-8">No events yet</p>}
            </div>
          )}

          {activeTab === 'places' && (
            <div className="space-y-3 fade-in">
              {orgPlaces.length > 0 ? orgPlaces.map(place => (
                <button key={place.id} onClick={() => navigate(`/place/${place.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl border border-border hover:border-[#C9A84C]/40 transition-all text-left">
                  <img src={place.coverPhoto} alt={place.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{place.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                    </div>
                    <p className="text-xs text-[#C9A84C] font-semibold mt-0.5">{place.followerCount.toLocaleString()} followers</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </button>
              )) : <p className="text-sm text-muted-foreground text-center py-8">No places yet</p>}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-2 fade-in">
              {contributor.members.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-[#C9A84C] font-bold text-xs">
                    {member.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{member}</p>
                </div>
              ))}
              <div className="mt-4 p-4 bg-accent/50 rounded-2xl border border-[#C9A84C]/20">
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={14} className="text-[#C9A84C]" />
                  <span className="text-xs font-bold text-muted-foreground">Contact</span>
                </div>
                <a href={`mailto:${contributor.contactEmail}`} className="text-sm text-[#8B6914] font-semibold flex items-center gap-1.5 hover:underline">
                  {contributor.contactEmail}
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'collabs' && (
            <div className="space-y-3 fade-in">
              {collabOrgs.length > 0 ? collabOrgs.map(org => (
                <button key={org.id} onClick={() => navigate(`/profile/${org.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl border border-border hover:border-[#C9A84C]/40 transition-all text-left">
                  <img src={org.profilePhoto} alt={org.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{org.dominantNiche}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </button>
              )) : <p className="text-sm text-muted-foreground text-center py-8">No collaborators yet</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
