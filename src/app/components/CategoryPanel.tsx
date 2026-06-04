import { X } from 'lucide-react';
import { EVENT_CATEGORIES } from '../data/categories';

interface CategoryPanelProps {
  onSelect: (categoryId: string) => void;
  onClose: () => void;
  selected: string | null;
}

export default function CategoryPanel({ onSelect, onClose, selected }: CategoryPanelProps) {
  return (
    <div className="absolute inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-end justify-center md:items-center"
      onClick={onClose}>
      <div className="glass w-full max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl border border-white/60 p-5 slide-up"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Event Categories
            </h3>
            <p className="text-xs text-muted-foreground">Filter events & places by category</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {EVENT_CATEGORIES.map(cat => {
            const { Icon } = cat;
            const isSelected = selected === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { onSelect(cat.id); onClose(); }}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200"
                style={
                  isSelected
                    ? { background: cat.hex, color: '#fff', boxShadow: `0 4px 16px ${cat.hex}55` }
                    : { background: cat.bg, color: cat.hex }
                }
              >
                <Icon size={17} strokeWidth={2} />
                <span className="text-[9px] font-bold text-center leading-tight">{cat.short}</span>
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
