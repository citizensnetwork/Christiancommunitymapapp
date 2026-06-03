import { Outlet, useLocation, useNavigate } from 'react-router';
import BottomNav from './BottomNav';
import { Map, MessageCircle, Lightbulb, LayoutDashboard, Bell, Settings, Search, Crown } from 'lucide-react';
import { notifications, conversations, currentUser } from '../../data/mock-data';

const sidebarTabs = [
  { path: '/', label: 'Discover', icon: Map },
  { path: '/community', label: 'Kingdom Projects', icon: Lightbulb },
  { path: '/messages', label: 'Messages', icon: MessageCircle },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-white/40 z-40 shrink-0">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center shadow-lg">
              <Crown size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Kingdom
              </p>
              <p className="text-[10px] text-[#C9A84C] font-semibold tracking-widest uppercase">Connect</p>
            </div>
          </div>
        </div>

        {/* User mini-profile */}
        <div className="px-4 py-4 border-b border-white/20">
          <button onClick={() => navigate(`/profile/${currentUser.id}`)} className="flex items-center gap-3 w-full hover:bg-accent/50 rounded-xl p-2 transition-colors">
            <img src={currentUser.profilePhoto} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-[#C9A84C]/40" />
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-muted-foreground">Citizen</p>
            </div>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarTabs.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            const badge = path === '/notifications' ? unreadNotifs : path === '/messages' ? unreadMessages : 0;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 relative ${
                  isActive
                    ? 'bg-[#C9A84C]/15 text-[#8B6914] font-semibold'
                    : 'text-foreground/60 hover:bg-accent/60 hover:text-foreground'
                }`}
              >
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C9A84C] rounded-r-full" />}
                <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{label}</span>
                {badge > 0 && (
                  <span className="ml-auto w-5 h-5 bg-[#C9A84C] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom CTA */}
        <div className="px-4 py-4 border-t border-white/20">
          <div className="bg-gradient-to-br from-[#F2E8CC] to-[#E8D48B]/60 rounded-xl p-4">
            <p className="text-xs font-bold text-[#8B6914] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Become a Contributor</p>
            <p className="text-[10px] text-[#8B6914]/80 mb-3">Create events, places and lead your community.</p>
            <button className="w-full text-[10px] font-bold bg-[#C9A84C] text-white rounded-lg py-1.5 hover:bg-[#8B6914] transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
