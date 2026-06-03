import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Heart, Globe, Share2, Check, Bookmark, MessageCircle, HandHeart, Camera, Radio, ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';
import { events, categories, contributors, currentUser } from '../data/mock-data';

export default function EventProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);
  const [connected, setConnected] = useState(currentUser.connectedEvents.includes(id!));
  const [considered, setConsidered] = useState(currentUser.considerList.includes(id!));
  const [activeTab, setActiveTab] = useState<'about' | 'gallery' | 'updates'>('about');

  if (!event) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-muted-foreground">Event not found</p>
    </div>
  );

  const cat = categories.find(c => c.id === event.category);
  const org = contributors.find(c => c.id === event.organizerId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Hero */}
      <div className="relative h-72 shrink-0 overflow-hidden">
        <img src={event.coverPhoto} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <ArrowLeft size={18} />
        </button>

        {/* Share */}
        <button className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <Share2 size={15} />
        </button>

        {/* Live badge */}
        {event.isLive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-red-500 px-3 py-1 rounded-full shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-bold text-white">HAPPENING NOW</span>
          </div>
        )}

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="flex items-start gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: cat?.color }}>
                  {cat?.name}
                </span>
                {event.volunteeringEnabled && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A84C] text-white">
                    Volunteer Spots
                  </span>
                )}
              </div>
              <h1 className="text-white text-2xl leading-tight drop-shadow-lg">{event.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        {/* Action buttons */}
        <div className="px-5 py-4 flex gap-2 border-b border-border">
          <button
            onClick={() => setConnected(!connected)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${
              connected ? 'bg-[#C9A84C] text-white' : 'bg-foreground text-background hover:bg-foreground/90'
            }`}
          >
            {connected ? <Check size={16} /> : <Users size={16} />}
            {connected ? 'Connected — Going!' : 'Connect (RSVP)'}
          </button>
          <button
            onClick={() => setConsidered(!considered)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all ${
              considered ? 'bg-accent border-[#C9A84C]/40 text-[#8B6914]' : 'border-border text-muted-foreground'
            }`}
          >
            <Bookmark size={16} />
            {considered ? 'Considering' : 'Consider'}
          </button>
        </div>

        {/* Key info cards */}
        <div className="px-5 py-4 grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-[#C9A84C]" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Date</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-[#C9A84C]" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Time</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{event.time} – {event.endTime}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-[#C9A84C]" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Location</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{event.location}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{event.address}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="px-5 pb-4 grid grid-cols-3 gap-3 text-center">
          <div className="bg-card rounded-2xl p-3 border border-border">
            <p className="text-lg font-bold text-foreground">{event.connectCount}</p>
            <p className="text-[10px] text-muted-foreground">Connected</p>
          </div>
          <div className="bg-card rounded-2xl p-3 border border-border">
            <p className="text-lg font-bold text-foreground">{event.considerCount}</p>
            <p className="text-[10px] text-muted-foreground">Considering</p>
          </div>
          <div className="bg-card rounded-2xl p-3 border border-border">
            <p className="text-lg font-bold text-foreground">{event.upcomingDates.length}</p>
            <p className="text-[10px] text-muted-foreground">Upcoming</p>
          </div>
        </div>

        {/* Broadcast update (if any) */}
        {event.broadcastMessage && (
          <div className="mx-5 mb-4 bg-gradient-to-r from-[#F2E8CC] to-[#E8D48B]/40 rounded-2xl p-4 border border-[#C9A84C]/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center shrink-0">
                <Radio size={14} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#8B6914] mb-0.5">Organiser Broadcast</p>
                <p className="text-sm text-foreground">{event.broadcastMessage}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {event.broadcastTime ? new Date(event.broadcastTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-5">
          <div className="flex gap-0 bg-muted rounded-xl p-1 mb-4">
            {(['about', 'gallery', 'updates'] as const).map(tab => (
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
              <p className="text-sm text-foreground/80 leading-relaxed">{event.description}</p>

              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground border border-[#C9A84C]/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {event.upcomingDates.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">Upcoming Dates</h4>
                  <div className="space-y-2">
                    {event.upcomingDates.map(date => (
                      <div key={date} className="flex items-center gap-3 py-2 px-3 bg-card rounded-xl border border-border">
                        <Calendar size={14} className="text-[#C9A84C]" />
                        <span className="text-sm text-foreground">
                          {new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organiser */}
              {org && (
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">Organised by</h4>
                  <button
                    onClick={() => navigate(`/profile/${org.id}`)}
                    className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl border border-border hover:border-[#C9A84C]/40 transition-all"
                  >
                    <img src={org.profilePhoto} alt={org.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="text-left flex-1">
                      <p className="text-sm font-bold text-foreground">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.dominantNiche}</p>
                      <p className="text-xs text-[#C9A84C] font-semibold">{org.followerCount.toLocaleString()} followers</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </button>
                </div>
              )}

              {/* Volunteer */}
              {event.volunteeringEnabled && (
                <div className="bg-gradient-to-r from-[#DCFCE7] to-[#BBF7D0]/40 rounded-2xl p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <HandHeart size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-green-800">Volunteer Opportunity</p>
                      <p className="text-xs text-green-700">This event is looking for servants to help make it happen.</p>
                    </div>
                  </div>
                  <button className="w-full mt-3 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors">
                    Apply to Volunteer
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="fade-in">
              {event.gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {event.gallery.map((photo, i) => (
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

          {activeTab === 'updates' && (
            <div className="fade-in space-y-3">
              {event.broadcastMessage ? (
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <img src={org?.profilePhoto} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-foreground">{org?.name}</p>
                        <span className="text-[10px] text-muted-foreground">
                          {event.broadcastTime ? new Date(event.broadcastTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{event.broadcastMessage}</p>
                      <div className="flex gap-3 mt-2">
                        {['🙏', '🔥', '❤️'].map(emoji => (
                          <button key={emoji} className="text-base hover:scale-125 transition-transform">{emoji}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Radio size={32} className="text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">No broadcast updates yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="mx-5 mt-6 flex gap-2">
          {event.website && (
            <a href={event.website} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
              <Globe size={15} /> Website
            </a>
          )}
          <button onClick={() => navigate(`/messages?org=${event.organizerId}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
            <MessageCircle size={15} /> Message
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
            <Share2 size={15} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
