import { useLocation, useNavigate } from 'react-router';
import { Map, MessageCircle, Lightbulb, LayoutDashboard, Bell, Settings } from 'lucide-react';
import { notifications, conversations } from '../../data/mock-data';

const tabs = [
  { path: '/', label: 'Discover', icon: Map },
  { path: '/community', label: 'Kingdom', icon: Lightbulb },
  { path: '/messages', label: 'Messages', icon: MessageCircle },
  { path: '/notifications', label: 'Alerts', icon: Bell },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unread, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass border-t border-white/40 shadow-2xl px-2">
        <div className="flex items-center justify-around h-16 pb-0">
          {tabs.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            const badge = path === '/notifications' ? unreadNotifs : path === '/messages' ? unreadMessages : 0;

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'text-[#C9A84C]'
                    : 'text-foreground/40 hover:text-foreground/70'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-0.5 w-5 h-0.5 rounded-full bg-[#C9A84C]" />
                )}
                <div className="relative">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C9A84C] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#C9A84C]' : ''}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
