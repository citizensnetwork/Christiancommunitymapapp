import { X, Calendar, Clock, MapPin, Users, Heart, Globe, Share2, Check, Bookmark, MessageCircle, ChevronRight, HandHeart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { events, places, impactIdeas, categories, contributors, currentUser } from '../data/mock-data';
import { useState } from 'react';

interface EventPreviewPanelProps {
  id: string;
  type: 'event' | 'place' | 'idea';
  onClose: () => void;
}

export default function EventPreviewPanel({ id, type, onClose }: EventPreviewPanelProps) {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(currentUser.connectedEvents.includes(id));
  const [considered, setConsidered] = useState(currentUser.considerList.includes(id));

  let item: any = null;
  if (type === 'event') item = events.find(e => e.id === id);
  else if (type === 'place') item = places.find(p => p.id === id);
  else item = impactIdeas.find(i => i.id === id);

  if (!item) return null;

  const cat = categories.find(c => c.id === item.category);

  const handleView = () => {
    if (type === 'event') navigate(`/event/${id}`);
    else if (type === 'place') navigate(`/place/${id}`);
    else navigate('/community');
    onClose();
  };

  const handleOrgClick = () => {
    if (item.organizerId) navigate(`/profile/${item.organizerId}`);
    else if (item.author) navigate(`/profile/${item.author.id}`);
    onClose();
  };

  return (
    <div className="absolute bottom-16 left-0 right-0 z-50 px-3 pb-2 md:bottom-0 md:left-auto md:right-4 md:w-96 slide-up">
      <div className="glass rounded-2xl shadow-2xl overflow-hidden border border-white/60">
        {/* Cover photo */}
        <div className="relative h-40 overflow-hidden">
          {(item.coverPhoto) && (
            <img src={item.coverPhoto} alt={item.title || item.name}
              className="w-full h-full object-cover" />
          )}
          {type === 'idea' && (
            <div className="w-full h-full bg-gradient-to-br from-[#F2E8CC] to-[#E8D48B] flex items-center justify-center">
              <span className="text-5xl">💡</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg"
              style={{ background: cat?.color || '#C9A84C' }}>
              {cat?.name || 'Community'}
            </span>
          </div>

          {/* Live badge */}
          {item.isLive && (
            <div className="absolute top-3 right-12 flex items-center gap-1 bg-red-500 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-[9px] font-bold text-white">LIVE</span>
            </div>
          )}

          {/* Close */}
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
            <X size={14} className="text-white" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white text-sm leading-tight drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
              {item.title || item.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Meta info */}
          <div className="space-y-1.5">
            {item.date && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar size={12} className="text-[#C9A84C]" />
                <span>{new Date(item.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}</span>
                {item.time && <><Clock size={12} className="text-[#C9A84C] ml-2" /><span>{item.time}</span></>}
              </div>
            )}
            {(item.address || item.location) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin size={12} className="text-[#C9A84C]" />
                <span>{item.address || item.location}</span>
              </div>
            )}
            {item.connectCount !== undefined && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users size={12} className="text-[#C9A84C]" />
                <span>{item.connectCount} connected · {item.considerCount} considering</span>
              </div>
            )}
            {item.votes !== undefined && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Heart size={12} className="text-[#C9A84C]" />
                <span>{item.votes} / 1000 votes · {item.status === 'confirmed' ? '✅ Confirmed' : item.status === 'inProcess' ? '⚙️ In Process' : '🗳️ Voting'}</span>
              </div>
            )}
          </div>

          {/* Organiser */}
          <button onClick={handleOrgClick} className="flex items-center gap-2 w-full hover:bg-accent/50 rounded-xl p-2 -mx-2 transition-colors">
            <img
              src={type === 'idea' ? item.author?.profilePhoto : contributors.find(c => c.id === item.organizerId)?.profilePhoto || ''}
              alt=""
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#C9A84C]/30"
            />
            <span className="text-xs font-semibold text-foreground">
              {item.organizerName || item.author?.name}
            </span>
            <ChevronRight size={12} className="ml-auto text-muted-foreground" />
          </button>

          {/* Action buttons */}
          {type !== 'idea' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConnected(!connected)}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  connected
                    ? 'bg-[#C9A84C] text-white shadow-lg'
                    : 'bg-foreground text-background hover:bg-foreground/90'
                }`}
              >
                {connected ? <Check size={13} /> : <Users size={13} />}
                {connected ? 'Connected' : 'Connect'}
              </button>
              <button
                onClick={() => setConsidered(!considered)}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  considered
                    ? 'bg-accent border-[#C9A84C]/40 text-[#8B6914]'
                    : 'border-border text-muted-foreground hover:border-[#C9A84C]/40'
                }`}
              >
                <Bookmark size={13} />
                {considered ? 'Considering' : 'Consider'}
              </button>
            </div>
          )}

          {type === 'idea' && (
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-foreground text-background hover:bg-foreground/90 transition-all">
                <Heart size={13} /> Collab
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border border-border text-muted-foreground hover:border-[#C9A84C]/40 transition-all">
                <X size={13} /> Dismiss
              </button>
            </div>
          )}

          {/* Secondary actions */}
          <div className="flex items-center gap-2 pt-1">
            <button onClick={handleView} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-[#8B6914] bg-[#F2E8CC] hover:bg-[#E8D48B]/60 transition-colors">
              View Full Profile
            </button>
            {item.website && (
              <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                <Globe size={14} />
              </button>
            )}
            <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
              <Share2 size={14} />
            </button>
            {item.organizerId && (
              <button onClick={() => { navigate(`/messages?org=${item.organizerId}`); onClose(); }}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                <MessageCircle size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
