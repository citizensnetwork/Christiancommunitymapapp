import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Settings, LogOut, ChevronRight, Crown, Shield, User, Building2, Check } from 'lucide-react';
import { useUser, UserRole } from '../../context/UserContext';

interface ProfilePanelProps {
  onClose: () => void;
  anchor?: 'sidebar' | 'top';
}

const ROLES: { role: UserRole; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { role: 'citizen', label: 'Citizen', desc: 'Community member', icon: User, color: '#3498DB' },
  { role: 'contributor', label: 'Contributor', desc: 'Event & place organiser', icon: Building2, color: '#C9A84C' },
  { role: 'admin', label: 'Admin', desc: 'Platform administrator', icon: Shield, color: '#8E44AD' },
];

export default function ProfilePanel({ onClose, anchor = 'sidebar' }: ProfilePanelProps) {
  const { user, role, setRole } = useUser();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const posClass = anchor === 'sidebar'
    ? 'left-full bottom-4 ml-2'
    : 'right-0 top-full mt-2';

  return (
    <div
      ref={ref}
      className={`absolute z-[100] w-72 glass rounded-2xl shadow-2xl border border-white/60 overflow-hidden fade-in ${posClass}`}
    >
      {/* Header */}
      <div className="relative">
        <div className="h-20 overflow-hidden">
          <img src={user.coverPhoto} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <img src={user.profilePhoto} alt={user.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-background shadow-lg" />
        </div>
      </div>

      <div className="pt-8 pb-4 px-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">{user.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {role === 'admin' && <Shield size={11} className="text-[#8E44AD]" />}
              {role === 'contributor' && <Crown size={11} className="text-[#C9A84C]" />}
              <span className="text-[10px] font-semibold text-muted-foreground capitalize">{role}</span>
              {role === 'contributor' && user.involvementLevel && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F2E8CC] text-[#8B6914]">
                  {user.involvementLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">{user.bio}</p>

        {/* Nav links */}
        <div className="mt-3 space-y-0.5 border-t border-border pt-3">
          <button
            onClick={() => { navigate(`/profile/${user.id}`); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-accent/60 transition-colors text-left"
          >
            <User size={15} className="text-muted-foreground" />
            <span>View Profile</span>
            <ChevronRight size={13} className="ml-auto text-muted-foreground" />
          </button>
          <button
            onClick={() => { navigate('/settings'); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-accent/60 transition-colors text-left"
          >
            <Settings size={15} className="text-muted-foreground" />
            <span>Settings</span>
            <ChevronRight size={13} className="ml-auto text-muted-foreground" />
          </button>
        </div>

        {/* Role switcher (demo) */}
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">
            Switch Role (Demo)
          </p>
          {ROLES.map(({ role: r, label, desc, icon: Icon, color }) => (
            <button
              key={r}
              onClick={() => { setRole(r); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all text-left ${
                role === r ? 'bg-accent/80' : 'hover:bg-accent/40'
              }`}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: color + '22', color }}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
              {role === r && <Check size={13} className="text-[#C9A84C] shrink-0" />}
            </button>
          ))}
        </div>

        {/* Sign out */}
        <div className="mt-3 border-t border-border pt-3">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/8 transition-colors">
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
