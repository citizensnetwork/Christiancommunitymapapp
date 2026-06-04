import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import BottomNav from './BottomNav';
import ProfilePanel from './ProfilePanel';
import {
  Map, MessageCircle, Lightbulb, LayoutDashboard, Bell,
  Settings, Shield, Crown, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { notifications, conversations } from '../../data/mock-data';
import { useUser } from '../../context/UserContext';

const baseTabs = [
  { path: '/', label: 'Discover', icon: Map },
  { path: '/community', label: 'Kingdom Projects', icon: Lightbulb },
  { path: '/messages', label: 'Messages', icon: MessageCircle },
  { path: '/notifications', label: 'Notifications', icon: Bell },
];

const contributorTabs = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const adminTabs = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin', label: 'Admin Panel', icon: Shield },
];

const bottomTabs = [
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, isAdmin, isContributor } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unread, 0);

  const allTabs = [
    ...baseTabs,
    ...(isAdmin ? adminTabs : isContributor ? contributorTabs : []),
    ...bottomTabs,
  ];

  const badge = (path: string) => {
    if (path === '/notifications') return unreadNotifs;
    if (path === '/messages') return unreadMessages;
    return 0;
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const roleBadge = role === 'admin'
    ? { label: 'Admin', color: '#8E44AD', Icon: Shield }
    : role === 'contributor'
    ? { label: user.involvementLevel || 'Contributor', color: '#C9A84C', Icon: Crown }
    : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col glass border-r border-white/40 z-40 shrink-0 transition-all duration-300 relative ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className={`px-4 py-5 border-b border-white/30 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center shadow-lg shrink-0">
            <Crown size={16} className="text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-foreground tracking-tight leading-none"
                style={{ fontFamily: 'Playfair Display, serif' }}>Kingdom</p>
              <p className="text-[10px] text-[#C9A84C] font-bold tracking-widest uppercase mt-0.5">Connect</p>
            </div>
          )}
        </div>

        {/* User mini-profile */}
        <div className={`border-b border-white/20 ${collapsed ? 'px-2 py-3' : 'px-3 py-3'}`}>
          <div className="relative">
            <button
              onClick={() => setShowProfile(s => !s)}
              className={`flex items-center w-full rounded-xl transition-colors hover:bg-accent/50 p-2 ${collapsed ? 'justify-center' : 'gap-3'}`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#C9A84C]/40"
                />
                {role !== 'citizen' && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center"
                    style={{ background: roleBadge?.color }}>
                    {roleBadge && <roleBadge.Icon size={8} className="text-white" />}
                  </span>
                )}
              </div>
              {!collapsed && (
                <div className="text-left overflow-hidden flex-1">
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
                </div>
              )}
            </button>

            {showProfile && (
              <ProfilePanel onClose={() => setShowProfile(false)} anchor="sidebar" />
            )}
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {allTabs.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            const b = badge(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                title={collapsed ? label : undefined}
                className={`w-full flex items-center rounded-xl text-sm transition-all duration-200 relative ${
                  collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-4 py-2.5'
                } ${
                  active
                    ? 'bg-[#C9A84C]/12 text-[#8B6914] font-semibold'
                    : 'text-foreground/60 hover:bg-accent/60 hover:text-foreground'
                }`}
              >
                {active && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#C9A84C] rounded-r-full" />
                )}
                <div className="relative shrink-0">
                  <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
                  {b > 0 && collapsed && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#C9A84C] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {b}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{label}</span>
                    {b > 0 && (
                      <span className="w-5 h-5 bg-[#C9A84C] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                        {b}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Contributor CTA (expanded only) */}
        {!collapsed && role === 'citizen' && (
          <div className="px-3 pb-3 border-t border-white/20 pt-3">
            <div className="bg-gradient-to-br from-[#F2E8CC] to-[#E8D48B]/50 rounded-xl p-3.5">
              <p className="text-[11px] font-bold text-[#8B6914] mb-0.5"
                style={{ fontFamily: 'Playfair Display, serif' }}>Become a Contributor</p>
              <p className="text-[9px] text-[#8B6914]/75 mb-2.5">Create events, places & lead your community.</p>
              <button className="w-full text-[10px] font-bold bg-[#C9A84C] text-white rounded-lg py-1.5 hover:bg-[#8B6914] transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <div className={`border-t border-white/20 ${collapsed ? 'p-2' : 'px-3 py-3'}`}>
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all ${
              collapsed ? 'w-full py-2' : 'w-full gap-2 py-2 text-xs font-medium'
            }`}
          >
            {collapsed
              ? <ChevronRight size={16} />
              : <><ChevronLeft size={14} /><span>Collapse</span></>
            }
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
