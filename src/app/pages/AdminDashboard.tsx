import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Users, BarChart2, FileText, MessageSquare, ChevronRight, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApplications } from '../hooks/useMapData';
import { EVENT_CATEGORIES } from '../data/categories';
import { useUser } from '../context/UserContext';

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: '#D97706', bg: '#FEF3C7', Icon: Clock },
  approved: { label: 'Approved', color: '#16A34A', bg: '#DCFCE7', Icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEE2E2', Icon: XCircle },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useUser();
  const { applications, loading, reviewApplication } = useApplications();
  const [activeTab, setActiveTab] = useState<'applications' | 'overview' | 'reports'>('applications');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <Shield size={28} className="text-destructive" />
        </div>
        <h3 className="text-foreground">Admin Access Required</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Switch to the Admin role using the profile panel to access this area.
        </p>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-foreground text-background rounded-xl text-sm font-bold">
          Back to Map
        </button>
      </div>
    );
  }

  const filtered = applications
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()));

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    setSubmitting(true);
    await reviewApplication(id, status, reviewNote.trim() || undefined);
    setReviewingId(null);
    setReviewNote('');
    setSubmitting(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border glass">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#8E44AD22' }}>
            <Shield size={18} style={{ color: '#8E44AD' }} />
          </div>
          <div>
            <h2 className="text-foreground leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Panel</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Platform management & oversight</p>
          </div>
          {pendingCount > 0 && (
            <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706]">
              {pendingCount} pending
            </span>
          )}
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Total Apps', value: applications.length, color: '#5D6D7E' },
            { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: '#D97706' },
            { label: 'Approved', value: applications.filter(a => a.status === 'approved').length, color: '#16A34A' },
            { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#DC2626' },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl p-2.5 border border-border text-center">
              <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 bg-muted rounded-xl p-1">
          {(['applications', 'overview', 'reports'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-white shadow text-foreground' : 'text-muted-foreground'
              }`}
            >
              {tab === 'applications' ? `Applications${pendingCount ? ` (${pendingCount})` : ''}` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        {activeTab === 'applications' && (
          <div className="px-5 py-4 space-y-4 fade-in">
            {/* Search + status filter */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-card border border-border rounded-xl">
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search applicants…"
                  className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === s ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText size={28} className="text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No applications match your filter</p>
              </div>
            ) : (
              filtered.map(app => {
                const statusCfg = STATUS_CONFIG[app.status];
                const cat = EVENT_CATEGORIES.find(c => c.id === app.category);
                const isReviewing = reviewingId === app.id;

                return (
                  <div key={app.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                    {/* Card header */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <img src={app.photo} alt={app.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-foreground">{app.name}</p>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                              style={{ background: statusCfg.bg, color: statusCfg.color }}>
                              <statusCfg.Icon size={9} className="inline mr-0.5" />
                              {statusCfg.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {cat && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ background: cat.bg, color: cat.hex }}>
                                {cat.name}
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground">
                              Applied {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{app.bio}</p>

                      {/* Reason */}
                      <div className="mt-3 p-3 bg-muted/60 rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
                          Why they want to contribute
                        </p>
                        <p className="text-xs text-foreground leading-relaxed">{app.reason}</p>
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Users size={11} className="text-[#C9A84C]" />
                          <span>{app.weeklyEvents} events/week (community posts)</span>
                        </div>
                        {app.socialLinks && Object.values(app.socialLinks)[0] && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]">{Object.values(app.socialLinks)[0]}</span>
                          </div>
                        )}
                      </div>

                      {/* Existing review note */}
                      {app.reviewNote && (
                        <div className="mt-3 p-3 bg-card border border-border rounded-xl">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Admin Note</p>
                          <p className="text-xs text-foreground">{app.reviewNote}</p>
                        </div>
                      )}
                    </div>

                    {/* Review actions (pending only) */}
                    {app.status === 'pending' && (
                      <div className="border-t border-border p-4">
                        {!isReviewing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setReviewingId(app.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-[#DCFCE7] text-[#16A34A] hover:bg-green-100 transition-colors"
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button
                              onClick={() => setReviewingId(`${app.id}-reject`)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-[#FEE2E2] text-[#DC2626] hover:bg-red-100 transition-colors"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 fade-in">
                            <p className="text-xs font-bold text-foreground">
                              {reviewingId === app.id ? '✅ Approving' : '❌ Rejecting'} — {app.name}
                            </p>
                            <textarea
                              value={reviewNote}
                              onChange={e => setReviewNote(e.target.value)}
                              placeholder="Optional note to applicant…"
                              rows={2}
                              className="w-full px-3 py-2 bg-muted rounded-xl text-xs text-foreground placeholder:text-muted-foreground outline-none resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                disabled={submitting}
                                onClick={() => handleReview(app.id, reviewingId === app.id ? 'approved' : 'rejected')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50 ${
                                  reviewingId === app.id ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                }`}
                              >
                                {submitting ? 'Submitting…' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => { setReviewingId(null); setReviewNote(''); }}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Approved status */}
                    {app.status === 'approved' && (
                      <div className="border-t border-green-100 px-4 py-3 bg-[#DCFCE7]/30 flex items-center gap-2">
                        <CheckCircle size={14} className="text-[#16A34A]" />
                        <p className="text-xs font-semibold text-[#16A34A]">
                          Approved — Contributor access granted
                          {app.reviewedAt ? ` · ${new Date(app.reviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : ''}
                        </p>
                      </div>
                    )}

                    {/* Rejected status */}
                    {app.status === 'rejected' && (
                      <div className="border-t border-red-100 px-4 py-3 bg-[#FEE2E2]/30 flex items-center gap-2">
                        <XCircle size={14} className="text-[#DC2626]" />
                        <p className="text-xs font-semibold text-[#DC2626]">
                          Rejected
                          {app.reviewedAt ? ` · ${new Date(app.reviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : ''}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="px-5 py-4 space-y-4 fade-in">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Platform Overview</p>
            {[
              { label: 'Total Events', value: '6', icon: '📅', color: '#C9A84C' },
              { label: 'Total Places', value: '3', icon: '📍', color: '#3498DB' },
              { label: 'Active Citizens', value: '3', icon: '👥', color: '#2ECC71' },
              { label: 'Contributors', value: '4', icon: '⭐', color: '#9B59B6' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            ))}

            <div className="p-4 bg-gradient-to-br from-[#F2E8CC] to-[#E8D48B]/30 rounded-2xl border border-[#C9A84C]/30">
              <p className="text-sm font-bold text-[#8B6914] mb-1">More Admin Tools Coming</p>
              <p className="text-xs text-[#8B6914]/80">Platform-wide analytics, user management, reports, and login-as-contributor are next in the roadmap.</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="px-5 py-4 fade-in">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <BarChart2 size={22} className="text-muted-foreground/40" />
              </div>
              <p className="text-sm font-bold text-foreground mb-1">Reports Coming Soon</p>
              <p className="text-xs text-muted-foreground">Platform analytics, content reports, and moderation tools will be available here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
