import { useState } from 'react';
import { Bell, MessageCircle, Users, Heart, Lightbulb, Radio, Check, CheckCheck, ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { notifications } from '../data/mock-data';

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  broadcast: { icon: Radio, color: '#C9A84C', bg: '#F2E8CC' },
  friend: { icon: Users, color: '#2563EB', bg: '#DBEAFE' },
  convince: { icon: Heart, color: '#EC4899', bg: '#FCE7F3' },
  message: { icon: MessageCircle, color: '#16A34A', bg: '#DCFCE7' },
  idea: { icon: Lightbulb, color: '#D97706', bg: '#FEF3C7' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(notifications.map(n => ({ ...n })));
  const [filter, setFilter] = useState<string | null>(null);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = filter ? notifs.filter(n => n.type === filter) : notifs;
  const unreadCount = notifs.filter(n => !n.read).length;

  const handleNotifClick = (notif: typeof notifications[0]) => {
    markRead(notif.id);
    if (notif.type === 'message' && (notif as any).convId) navigate(`/messages/${(notif as any).convId}`);
    else if (notif.type === 'broadcast' && (notif as any).eventId) navigate(`/event/${(notif as any).eventId}`);
    else if (notif.type === 'convince' && (notif as any).eventId) navigate(`/event/${(notif as any).eventId}`);
    else if (notif.type === 'friend' && (notif as any).userId) navigate(`/profile/${(notif as any).userId}`);
    else if (notif.type === 'idea') navigate('/community');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border glass">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-foreground flex items-center justify-center">
              <Bell size={17} className="text-background" />
            </div>
            <div>
              <h2 className="text-foreground leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>Notifications</h2>
              {unreadCount > 0 && <p className="text-xs text-[#C9A84C] font-semibold mt-0.5">{unreadCount} unread</p>}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <CheckCheck size={12} /> Mark all read
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: null, label: 'All' },
            { id: 'broadcast', label: '📣 Broadcasts' },
            { id: 'message', label: '💬 Messages' },
            { id: 'friend', label: '🤝 Friends' },
            { id: 'convince', label: '👀 Convince' },
            { id: 'idea', label: '💡 Ideas' },
          ].map(f => (
            <button
              key={String(f.id)}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <Bell size={22} className="text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">No notifications here</p>
          </div>
        ) : (
          filtered.map(notif => {
            const config = typeConfig[notif.type] || typeConfig.broadcast;
            const Icon = config.icon;
            return (
              <button
                key={notif.id}
                onClick={() => handleNotifClick(notif as any)}
                className={`w-full flex items-start gap-3 px-5 py-4 border-b border-border/50 hover:bg-accent/30 transition-colors text-left ${!notif.read ? 'bg-[#F2E8CC]/20' : ''}`}
              >
                {/* Icon or photo */}
                <div className="relative shrink-0">
                  {notif.photo ? (
                    <img src={notif.photo} alt="" className="w-11 h-11 rounded-xl object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: config.bg, color: config.color }}>
                      <Icon size={18} />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background"
                    style={{ background: config.bg, color: config.color }}>
                    <Icon size={11} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${notif.read ? 'text-foreground/80' : 'text-foreground font-semibold'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.body}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{notif.time}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!notif.read && (
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full" />
                  )}
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
