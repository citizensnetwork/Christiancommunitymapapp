import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Search, MessageCircle, Plus } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { conversations, currentUser } from '../data/mock-data';

export default function Messages() {
  const navigate = useNavigate();
  const { convId } = useParams();
  const location = useLocation();
  const [activeConv, setActiveConv] = useState(convId || null);
  const [messageText, setMessageText] = useState('');
  const [convMessages, setConvMessages] = useState<Record<string, any[]>>(
    Object.fromEntries(conversations.map(c => [c.id, c.messages]))
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conv = conversations.find(c => c.id === activeConv);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv, convMessages]);

  useEffect(() => {
    if (convId) setActiveConv(convId);
  }, [convId]);

  const sendMessage = () => {
    if (!messageText.trim() || !activeConv) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      from: currentUser.id,
      text: messageText.trim(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
    };
    setConvMessages(prev => ({
      ...prev,
      [activeConv]: [...(prev[activeConv] || []), newMsg],
    }));
    setMessageText('');
  };

  const showList = !activeConv || (!convId && !activeConv);

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      {/* Conversation list */}
      <div className={`flex flex-col w-full md:w-80 md:border-r border-border bg-background shrink-0 ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="px-5 py-5 border-b border-border">
          <h2 className="text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Messages</h2>
          <div className="flex items-center gap-2 mt-3 px-3 py-2.5 bg-muted rounded-xl">
            <Search size={14} className="text-muted-foreground" />
            <input placeholder="Search conversations..." className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 border-b border-border/50 hover:bg-accent/40 transition-colors text-left ${
                activeConv === conv.id ? 'bg-accent/60' : ''
              }`}
            >
              <div className="relative shrink-0">
                <img src={conv.participantPhoto} alt={conv.participantName}
                  className="w-12 h-12 rounded-xl object-cover" />
                {conv.isOrg && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#C9A84C] rounded-full border-2 border-background flex items-center justify-center text-[7px] font-bold text-white">✦</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-bold text-foreground truncate">{conv.participantName}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{conv.lastTime}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 bg-[#C9A84C] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* New message button */}
        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-colors">
            <Plus size={16} /> New Message
          </button>
        </div>
      </div>

      {/* Conversation view */}
      {activeConv ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Conv header */}
          <div className="px-4 py-3.5 border-b border-border flex items-center gap-3 glass">
            <button onClick={() => setActiveConv(null)} className="md:hidden w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
              <ArrowLeft size={18} />
            </button>
            {conv && (
              <>
                <img src={conv.participantPhoto} alt={conv.participantName}
                  className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-bold text-foreground">{conv.participantName}</p>
                  <p className="text-[10px] text-[#16A34A] font-semibold">● Active</p>
                </div>
              </>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {(convMessages[activeConv] || []).map((msg: any, i: number) => {
              const isMe = msg.from === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} fade-in`}>
                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-foreground text-background rounded-br-sm'
                      : 'glass border border-white/60 text-foreground rounded-bl-sm'
                  }`}>
                    {msg.text}
                    <p className={`text-[9px] mt-1 ${isMe ? 'text-white/50' : 'text-muted-foreground'}`}>{msg.time}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-4 border-t border-border glass">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <input
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  messageText.trim() ? 'bg-foreground text-background hover:bg-foreground/90' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageCircle size={28} className="text-white" />
            </div>
            <h3 className="text-foreground mb-2">Your Messages</h3>
            <p className="text-sm text-muted-foreground">Select a conversation to read and reply</p>
          </div>
        </div>
      )}
    </div>
  );
}
