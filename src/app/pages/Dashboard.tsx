import { useState } from 'react';
import { LayoutDashboard, Plus, Eye, MessageCircle, Users, Radio, TrendingUp, Calendar, MapPin, Settings, ChevronRight, CheckCircle, Pencil, Star } from 'lucide-react';
import { useNavigate } from 'react-router';
import { events, places, categories, contributors, conversations } from '../data/mock-data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const myContributor = contributors[0];
const myEvents = events.filter(e => e.organizerId === myContributor.id);
const myPlaces = places.filter(p => p.organizerId === myContributor.id);

const weeklyData = [
  { day: 'Mon', connects: 12, views: 45 },
  { day: 'Tue', connects: 8, views: 32 },
  { day: 'Wed', connects: 25, views: 87 },
  { day: 'Thu', connects: 18, views: 63 },
  { day: 'Fri', connects: 41, views: 120 },
  { day: 'Sat', connects: 35, views: 98 },
  { day: 'Sun', connects: 52, views: 145 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'messages' | 'tools'>('overview');
  const [broadcastText, setBroadcastText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const totalConnects = myEvents.reduce((acc, e) => acc + e.connectCount, 0);
  const totalConsidering = myEvents.reduce((acc, e) => acc + e.considerCount, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border glass">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <img src={myContributor.profilePhoto} alt={myContributor.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#C9A84C]/40" />
            <div>
              <h2 className="text-foreground leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>Dashboard</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{myContributor.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F2E8CC] text-[#8B6914]">
              {myContributor.involvementLevel}
            </span>
            <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        {/* Quick stats */}
        <div className="px-5 py-4 grid grid-cols-4 gap-2">
          {[
            { label: 'Connected', value: totalConnects, color: '#C9A84C' },
            { label: 'Considering', value: totalConsidering, color: '#7C3AED' },
            { label: 'Events', value: myEvents.length, color: '#16A34A' },
            { label: 'Places', value: myPlaces.length, color: '#2563EB' },
          ].map(stat => (
            <div key={stat.label} className="bg-card rounded-2xl p-3 border border-border text-center">
              <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[9px] text-muted-foreground leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-5 mb-4">
          <div className="flex gap-0 bg-muted rounded-xl p-1 overflow-x-auto">
            {(['overview', 'events', 'messages', 'tools'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all px-2 ${
                  activeTab === tab ? 'bg-white shadow text-foreground' : 'text-muted-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5">
          {activeTab === 'overview' && (
            <div className="space-y-4 fade-in">
              {/* Analytics chart */}
              <div className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-foreground">This Week's Activity</p>
                  <span className="text-xs text-[#C9A84C] font-semibold flex items-center gap-1">
                    <TrendingUp size={12} /> +24%
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={weeklyData} barGap={4}>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#7A7060' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px' }}
                    />
                    <Bar dataKey="connects" name="Connects" radius={[4, 4, 0, 0]}>
                      {weeklyData.map((_, i) => <Cell key={i} fill="#C9A84C" />)}
                    </Bar>
                    <Bar dataKey="views" name="Views" radius={[4, 4, 0, 0]}>
                      {weeklyData.map((_, i) => <Cell key={i} fill="#E8D48B" />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent activity */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-bold text-foreground">Recent Activity</p>
                </div>
                {[
                  { icon: Users, text: '12 new citizens connected to Sunday Glory Service', time: '30 min ago', color: '#C9A84C' },
                  { icon: MessageCircle, text: 'New message from Lydia Mensah', time: '1 hour ago', color: '#2563EB' },
                  { icon: Eye, text: 'Kingdom Creative Arts Workshop viewed 48 times today', time: '2 hours ago', color: '#7C3AED' },
                  { icon: CheckCircle, text: 'Volunteer application received for Feed the City', time: '3 hours ago', color: '#16A34A' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-b-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: item.color + '20', color: item.color }}>
                      <item.icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug">{item.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contributor profile quick links */}
              <button onClick={() => navigate(`/profile/${myContributor.id}`)}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-[#F2E8CC] to-[#E8D48B]/30 rounded-2xl border border-[#C9A84C]/30 hover:border-[#C9A84C]/60 transition-all">
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-[#8B6914]">View Public Profile</p>
                  <p className="text-xs text-[#8B6914]/70">{myContributor.followerCount.toLocaleString()} followers · {myContributor.dominantNiche}</p>
                </div>
                <ChevronRight size={16} className="text-[#C9A84C]" />
              </button>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4 fade-in">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-xl text-sm font-bold hover:bg-foreground/90 transition-colors">
                <Plus size={16} /> Create New Event
              </button>

              {myEvents.map(event => {
                const cat = categories.find(c => c.id === event.category);
                return (
                  <div key={event.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="relative h-28">
                      <img src={event.coverPhoto} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {event.isLive && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          <span className="text-[9px] font-bold text-white">LIVE</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                        <p className="text-white text-xs font-bold drop-shadow truncate">{event.title}</p>
                        <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded shrink-0" style={{ background: cat?.color }}>
                          {cat?.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Users size={11} className="text-[#C9A84C]" />
                          <span>{event.connectCount} connected</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star size={11} className="text-[#C9A84C]" />
                          <span>{event.considerCount} considering</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} className="text-[#C9A84C]" />
                          <span>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/event/${event.id}`)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/70 transition-colors">
                          <Eye size={13} /> View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/70 transition-colors">
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => { setSelectedEvent(event.id); setActiveTab('tools'); }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#F2E8CC] text-[#8B6914] text-xs font-semibold hover:bg-[#E8D48B]/60 transition-colors">
                          <Radio size={13} /> Broadcast
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Places */}
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2">Your Places</p>
              {myPlaces.map(place => (
                <div key={place.id} className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border">
                  <img src={place.coverPhoto} alt={place.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{place.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                    </div>
                    <p className="text-xs text-[#C9A84C] font-semibold">{place.followerCount.toLocaleString()} followers</p>
                  </div>
                  <button onClick={() => navigate(`/place/${place.id}`)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-3 fade-in">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Recent Conversations</p>
              {conversations.slice(0, 2).map(conv => (
                <button key={conv.id} onClick={() => navigate(`/messages/${conv.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl border border-border hover:border-[#C9A84C]/40 transition-all text-left">
                  <div className="relative">
                    <img src={conv.participantPhoto} alt={conv.participantName} className="w-10 h-10 rounded-xl object-cover" />
                    {conv.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{conv.participantName}</p>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastTime}</span>
                </button>
              ))}
              <button onClick={() => navigate('/messages')}
                className="w-full py-3 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:border-foreground/30 transition-colors">
                View All Messages
              </button>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-4 fade-in">
              {/* Broadcast tool */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl gold-gradient flex items-center justify-center">
                    <Radio size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Broadcast Update</p>
                    <p className="text-xs text-muted-foreground">Notify all attendees, followers & considerers</p>
                  </div>
                </div>

                {!broadcastSent ? (
                  <>
                    <select
                      value={selectedEvent}
                      onChange={e => setSelectedEvent(e.target.value)}
                      className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground border-0 outline-none mb-2"
                    >
                      <option value="">Select Event / Place...</option>
                      {myEvents.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                      {myPlaces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <textarea
                      value={broadcastText}
                      onChange={e => setBroadcastText(e.target.value)}
                      placeholder="Write your broadcast message... (visible as speech bubble on map for 24hrs)"
                      rows={3}
                      className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none mb-3"
                    />
                    <button
                      disabled={!broadcastText || !selectedEvent}
                      onClick={() => setBroadcastSent(true)}
                      className="w-full py-3 bg-foreground text-background rounded-xl text-sm font-bold hover:bg-foreground/90 transition-all disabled:opacity-40"
                    >
                      Send Broadcast
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center py-4 text-center">
                    <CheckCircle size={28} className="text-green-500 mb-2" />
                    <p className="text-sm font-bold text-foreground mb-0.5">Broadcast Sent!</p>
                    <p className="text-xs text-muted-foreground mb-3">All followers, attendees and considerers have been notified.</p>
                    <button onClick={() => { setBroadcastSent(false); setBroadcastText(''); setSelectedEvent(''); }}
                      className="px-4 py-2 bg-muted rounded-lg text-xs font-semibold">Send Another</button>
                  </div>
                )}
              </div>

              {/* More tools */}
              {[
                { label: 'Create Event', icon: Calendar, color: '#C9A84C', desc: 'Post a new event on the map' },
                { label: 'Add Place', icon: MapPin, color: '#2563EB', desc: 'Register a venue or community space' },
                { label: 'Volunteer Manager', icon: Users, color: '#16A34A', desc: 'Review volunteer applications' },
                { label: 'Analytics', icon: TrendingUp, color: '#7C3AED', desc: 'Detailed insights and reach data' },
              ].map(tool => (
                <button key={tool.label}
                  className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-[#C9A84C]/40 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: tool.color + '18', color: tool.color }}>
                    <tool.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tool.label}</p>
                    <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  </div>
                  <ChevronRight size={15} className="text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
