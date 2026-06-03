import { useState } from 'react';
import { Lightbulb, Plus, Heart, X, Users, ChevronRight, CheckCircle, Clock, Vote, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { impactIdeas, categories, currentUser } from '../data/mock-data';

const statusConfig = {
  voting: { label: 'Voting Open', color: '#2563EB', bg: '#DBEAFE', icon: Vote },
  inProcess: { label: 'In Process', color: '#D97706', bg: '#FEF3C7', icon: Clock },
  confirmed: { label: 'Confirmed', color: '#16A34A', bg: '#DCFCE7', icon: CheckCircle },
};

export default function Community() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ideas' | 'projects' | 'submit'>('ideas');
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [newIdea, setNewIdea] = useState({ title: '', description: '', category: '' });
  const [submitted, setSubmitted] = useState(false);

  const votingIdeas = impactIdeas.filter(i => i.status === 'voting');
  const inProcessIdeas = impactIdeas.filter(i => i.status === 'inProcess');
  const confirmedProjects = impactIdeas.filter(i => i.status === 'confirmed');

  const handleVote = (id: string) => {
    setVotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border glass">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl gold-gradient flex items-center justify-center shadow-lg">
            <Lightbulb size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Kingdom Projects</h2>
            <p className="text-xs text-muted-foreground">Impact Ideas · Community Collaboration</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Voting', count: votingIdeas.length, color: '#2563EB' },
            { label: 'In Process', count: inProcessIdeas.length, color: '#D97706' },
            { label: 'Confirmed', count: confirmedProjects.length, color: '#16A34A' },
          ].map(stat => (
            <div key={stat.label} className="bg-card rounded-xl p-3 border border-border text-center">
              <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.count}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 bg-muted rounded-xl p-1">
          {(['ideas', 'projects', 'submit'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-white shadow text-foreground' : 'text-muted-foreground'
              }`}
            >
              {tab === 'submit' ? '+ Submit Idea' : tab === 'projects' ? 'Projects' : 'Voting'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        {/* Map voting pills */}
        {activeTab === 'ideas' && (
          <div className="px-5 py-4 space-y-4 fade-in">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Voting Polls</p>
            {votingIdeas.map(idea => {
              const cat = categories.find(c => c.id === idea.category);
              const hasVoted = votes[idea.id];
              const currentVotes = idea.votes + (hasVoted ? 1 : 0);
              const progress = Math.min(100, (currentVotes / idea.threshold) * 100);

              return (
                <div key={idea.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                  {/* Vote progress bar */}
                  <div className="h-1.5 bg-muted">
                    <div className="h-full bg-gradient-to-r from-[#C9A84C] to-[#E8D48B] transition-all duration-500"
                      style={{ width: `${progress}%` }} />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {cat && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                              style={{ background: cat.bg, color: cat.color }}>{cat.name}</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-foreground leading-snug">{idea.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-[#C9A84C] shrink-0">
                        {currentVotes}/{idea.threshold}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{idea.description}</p>

                    <div className="flex items-center gap-3">
                      <button onClick={() => navigate(`/profile/${idea.author.id}`)}
                        className="flex items-center gap-1.5">
                        <img src={idea.author.profilePhoto} alt={idea.author.name}
                          className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-[10px] text-muted-foreground">{idea.author.name}</span>
                      </button>
                      {idea.collaborators.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Users size={10} />
                          <span>{idea.collaborators.length} collab{idea.collaborators.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button
                        onClick={() => handleVote(idea.id)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          hasVoted
                            ? 'bg-[#C9A84C] text-white shadow-md'
                            : 'bg-foreground text-background hover:bg-foreground/90'
                        }`}
                      >
                        <Heart size={13} fill={hasVoted ? 'currentColor' : 'none'} />
                        {hasVoted ? 'Voted!' : 'Vote'}
                      </button>
                      <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border border-border text-muted-foreground hover:border-[#C9A84C]/40 hover:text-foreground transition-all">
                        <Users size={13} /> Collab
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="px-5 py-4 space-y-6 fade-in">
            {/* In Process */}
            {inProcessIdeas.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">⚙️ In Process</p>
                {inProcessIdeas.map(idea => {
                  const cat = categories.find(c => c.id === idea.category);
                  return (
                    <div key={idea.id} className="bg-card rounded-2xl border border-[#D97706]/30 p-4 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        {cat && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: cat.bg, color: cat.color }}>{cat.name}</span>}
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FEF3C7] text-[#D97706]">In Process</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mb-1">{idea.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{idea.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <img src={idea.author.profilePhoto} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-[10px] text-muted-foreground">{idea.author.name} · {idea.votes} votes received</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Confirmed */}
            {confirmedProjects.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">✅ Confirmed Projects</p>
                {confirmedProjects.map(idea => {
                  const cat = categories.find(c => c.id === idea.category);
                  return (
                    <div key={idea.id} className="bg-card rounded-2xl border border-green-200 p-4 mb-3 bg-gradient-to-br from-white to-[#DCFCE7]/30">
                      <div className="flex items-center gap-2 mb-2">
                        {cat && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: cat.bg, color: cat.color }}>{cat.name}</span>}
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#DCFCE7] text-[#16A34A]">✅ Confirmed</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mb-1">{idea.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{idea.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <img src={idea.author.profilePhoto} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-[10px] text-muted-foreground">{idea.votes} votes · {idea.collaborators.length + 1} collaborators</span>
                      </div>
                      <button className="w-full mt-3 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors">
                        Join This Project
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="px-5 py-4 fade-in">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-[#DCFCE7] rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle size={28} className="text-green-600" />
                </div>
                <h3 className="text-foreground mb-2">Idea Submitted!</h3>
                <p className="text-sm text-muted-foreground mb-6">Your Impact Idea is now visible on the map for the community to vote on.</p>
                <button onClick={() => { setSubmitted(false); setNewIdea({ title: '', description: '', category: '' }); setActiveTab('ideas'); }}
                  className="px-6 py-3 bg-[#C9A84C] text-white rounded-xl font-bold text-sm">
                  View Voting Board
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#F2E8CC] to-[#E8D48B]/30 rounded-2xl p-4 border border-[#C9A84C]/30">
                  <p className="text-sm font-bold text-[#8B6914] mb-1">💡 What is an Impact Idea?</p>
                  <p className="text-xs text-[#8B6914]/80 leading-relaxed">
                    An Impact Idea is a public proposal for a community project. Once it receives 1,000 votes from the community, it becomes a confirmed Kingdom Project that moves forward.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">Project Title *</label>
                    <input
                      value={newIdea.title}
                      onChange={e => setNewIdea(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Free Community Mentorship Programme"
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:border-[#C9A84C]/60 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">Description *</label>
                    <textarea
                      value={newIdea.description}
                      onChange={e => setNewIdea(p => ({ ...p, description: e.target.value }))}
                      placeholder="Describe the impact this project will have on your community..."
                      rows={4}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm outline-none focus:border-[#C9A84C]/60 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">Category *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.slice(0, 6).map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setNewIdea(p => ({ ...p, category: cat.id }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all border ${
                            newIdea.category === cat.id ? 'border-transparent' : 'border-border'
                          }`}
                          style={newIdea.category === cat.id ? { background: cat.color, color: '#fff' } : { background: cat.bg, color: cat.color }}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => { if (newIdea.title && newIdea.description && newIdea.category) setSubmitted(true); }}
                    disabled={!newIdea.title || !newIdea.description || !newIdea.category}
                    className="w-full py-3.5 bg-foreground text-background rounded-xl text-sm font-bold hover:bg-foreground/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Submit Impact Idea
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
