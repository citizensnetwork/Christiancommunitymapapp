import { X, Music, Hand, Star, Heart, Users, Palette, BookOpen, Coffee, Globe, Zap } from 'lucide-react';
import { categories, events } from '../data/mock-data';

const iconMap: Record<string, React.ElementType> = {
  Music, Hand, Star, Heart, Users, Palette, BookOpen, Coffee, Globe, Zap,
};

interface CategoryPanelProps {
  onSelect: (categoryId: string) => void;
  onClose: () => void;
  selected: string | null;
}

export default function CategoryPanel({ onSelect, onClose, selected }: CategoryPanelProps) {
  return (
    <div className="absolute inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-end justify-center md:items-center"
      onClick={onClose}>
      <div className="glass w-full max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl border border-white/60 p-6 slide-up"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Categories</h3>
            <p className="text-xs text-muted-foreground">Select to filter events & places on the map</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {categories.map(cat => {
            const Icon = iconMap[cat.icon] || Globe;
            const count = events.filter(e => e.category === cat.id).length;
            const isSelected = selected === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { onSelect(cat.id); onClose(); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 ${
                  isSelected ? 'scale-105 shadow-lg' : 'hover:scale-105'
                }`}
                style={{
                  background: isSelected ? cat.color : cat.bg,
                  color: isSelected ? '#fff' : cat.color,
                }}
              >
                <Icon size={20} strokeWidth={2} />
                <span className="text-[9px] font-bold text-center leading-tight">{cat.name}</span>
                {count > 0 && (
                  <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-white/60'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <button
            onClick={() => { onSelect(''); onClose(); }}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground border border-border hover:border-foreground/20 transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
}
