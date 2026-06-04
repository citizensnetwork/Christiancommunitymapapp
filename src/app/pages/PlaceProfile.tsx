import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Globe, Share2, MessageCircle, HandHeart, Camera, Clock, Users, ChevronRight, Heart } from 'lucide-react';
import { useState } from 'react';
import { places, contributors, events, currentUser } from '../data/mock-data';
import { getEventCategory, getPlaceCategory, EVENT_CATEGORIES, LEGACY_CATEGORY_MAP } from '../data/categories';

export default function PlaceProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const place = places.find(p => p.id === id);
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'gallery'>('about');

  if (!place) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-muted-foreground">Place not found</p>
    </div>
  );

  const cat = getEventCategory(LEGACY_CATEGORY_MAP[place.category] || place.category) || getPlaceCategory(LEGACY_CATEGORY_MAP[place.category] || place.category);
  const org = contributors.find(c => c.id === place.organizerId);
  const placeEvents = events.filter(e => place.associatedEventIds.includes(e.id));

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Hero */}
      <div className="relative h-64 shrink-0 overflow-hidden">
        <img src={place.coverPhoto} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
          <ArrowLeft size={18} />
        </button>
        <button className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
          <Share2 size={15} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-2 inline-block"
            style={{ background: cat?.hex }}>
            {cat?.name}
          </span>
          <h1 className="text-white text-2xl drop-shadow-lg">{place.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin size={12} className="text-white/70" />
            <span className="text-xs text-white/70">{place.address}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        {/* Action buttons */}
        <div className="px-5 py-4 flex gap-2 border-b border-border">
          <button
            onClick={() => setFollowed(!followed)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              followed ? 'bg-[#C9A84C] text-white' : 'bg-foreground text-background'
            }`}
          >
            <Heart size={16} fill={followed ? 'currentColor' : 'none'} />
            {followed ? 'Following' : 'Follow Place'}
          </button>
          <button onClick={() => navigate(`/messages?org=${place.organizerId}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border border-border text-muted-foreground">
            <MessageCircle size={16} /> Message
          </button>
        </div>

        {/* Stats */}
        <div className="px-5 py-4 grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} className="text-[#C9A84C]" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Followers</span>
            </div>
            <p className="text-lg font-bold text-foreground">{place.followerCount.toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-[#C9A84C]" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Hours</span>
            </div>
            <p className="text-xs font-semibold text-foreground leading-snug">{place.openHours}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5">
          <div className="flex gap-0 bg-muted rounded-xl p-1 mb-4">
            {(['about', 'events', 'gallery'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeTab === tab ? 'bg-white shadow text-foreground' : 'text-muted-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'about' && (
            <div className="space-y-4 fade-in">
              <p className="text-sm text-foreground/80 leading-relaxed">{place.description}</p>

              {org && (
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">Managed by</h4>
                  <button onClick={() => navigate(`/profile/${org.id}`)}
                    className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl border border-border hover:border-[#C9A84C]/40 transition-all">
                    <img src={org.profilePhoto} alt={org.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="text-left flex-1">
                      <p className="text-sm font-bold text-foreground">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.dominantNiche}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </button>
                </div>
              )}

              {place.volunteeringEnabled && (
                <div className="bg-gradient-to-r from-[#DCFCE7] to-[#BBF7D0]/40 rounded-2xl p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <HandHeart size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-800">Serve Here</p>
                      <p className="text-xs text-green-700">Volunteer opportunities available at this place.</p>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors">
                    Apply to Serve
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3 fade-in">
              {placeEvents.length > 0 ? placeEvents.map(event => (
                <button key={event.id} onClick={() => navigate(`/event/${event.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl border border-border hover:border-[#C9A84C]/40 transition-all text-left">
                  <img src={event.coverPhoto} alt={event.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {event.time}
                    </p>
                    <p className="text-xs text-[#C9A84C] font-semibold mt-0.5">{event.connectCount} connected</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </button>
              )) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">No events listed at this place yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="fade-in">
              {place.gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {place.gallery.map((photo, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Camera size={32} className="text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">No gallery photos yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
