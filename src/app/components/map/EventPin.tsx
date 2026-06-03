import { Music, Hand, Star, Heart, Users, Palette, BookOpen, Coffee, Globe, Zap, MapPin, Lightbulb } from 'lucide-react';
import { categories } from '../../data/mock-data';

const iconMap: Record<string, React.ElementType> = {
  Music, Hand, Star, Heart, Users, Palette, BookOpen, Coffee, Globe, Zap, MapPin, Lightbulb,
};

interface PinEvent {
  id: string;
  category: string;
  title: string;
  isLive?: boolean;
  isBusy?: boolean;
  broadcastMessage?: string | null;
  mapX: number;
  mapY: number;
  name?: string;
}

interface EventPinProps {
  event: PinEvent;
  type: 'event' | 'place' | 'idea';
  isSelected: boolean;
  onClick: () => void;
}

export default function EventPin({ event, type, isSelected, onClick }: EventPinProps) {
  const cat = categories.find(c => c.id === event.category);
  const color = type === 'idea' ? '#C9A84C' : (cat?.color ?? '#0A0908');
  const bg = type === 'idea' ? '#F2E8CC' : (cat?.bg ?? '#F5F5F5');
  const iconName = type === 'idea' ? 'Lightbulb' : type === 'place' ? 'MapPin' : (cat?.icon ?? 'MapPin');
  const Icon = iconMap[iconName] || MapPin;

  return (
    <div
      className="absolute"
      style={{
        left: `${event.mapX}%`,
        top: `${event.mapY}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 30 : event.isLive ? 20 : 10,
      }}
    >
      {/* Broadcast bubble */}
      {event.broadcastMessage && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 broadcast-bubble z-40">
          <div className="glass px-2 py-1 rounded-full text-[8px] font-semibold text-foreground whitespace-nowrap shadow-lg border border-[#C9A84C]/30 max-w-[120px] truncate">
            💬
          </div>
        </div>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`relative transition-transform duration-200 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}
      >
        {/* Pulse ring for live events */}
        {(event.isLive || event.isBusy) && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping opacity-40"
              style={{ background: color, animationDuration: '1.8s' }} />
            <span className="absolute inset-[-4px] rounded-full animate-ping opacity-20"
              style={{ background: color, animationDuration: '1.8s', animationDelay: '0.4s' }} />
          </>
        )}

        {/* Pin body */}
        <div
          className={`relative flex items-center justify-center rounded-full shadow-lg transition-all ${
            type === 'place'
              ? 'w-8 h-8 rounded-xl'
              : type === 'idea'
              ? 'w-9 h-9 rounded-2xl'
              : 'w-10 h-10 rounded-full'
          } ${isSelected ? 'ring-2 ring-offset-1' : ''}`}
          style={{
            background: isSelected
              ? `linear-gradient(135deg, ${color}, ${color}dd)`
              : bg,
            color: isSelected ? '#fff' : color,
            boxShadow: isSelected
              ? `0 4px 20px ${color}80`
              : `0 2px 12px ${color}40`,
            ringColor: color,
          }}
        >
          <Icon size={type === 'event' ? 16 : 14} strokeWidth={2.5} />
        </div>

        {/* Live badge */}
        {event.isLive && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}

        {/* Pin label (selected) */}
        {isSelected && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 fade-in">
            <div className="glass px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap border border-white/60">
              <p className="text-[10px] font-bold text-foreground">{event.title || event.name}</p>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
