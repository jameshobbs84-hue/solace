import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type ContentItem } from '../data/content';
import { useContent } from '../context/ContentContext';
import PageTransition from '../components/PageTransition';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  content?: ContentItem[];
  community?: { title: string; space: string; likes: number; replies: number }[];
}

// Topic-based AI response mapping
const topicResponses: Record<string, { text: string; keywords: string[] }> = {
  sleep: {
    keywords: ['sleep', 'insomnia', 'rest', 'bedtime', 'night', 'tired', 'fatigue', 'nap'],
    text: `Quality sleep is one of the most important pillars of wellness. Here are some evidence-based strategies:\n\n**Create a consistent schedule** — Go to bed and wake up at the same time every day, even on weekends. This helps regulate your circadian rhythm.\n\n**Optimize your environment** — Keep your bedroom cool (65-68°F), dark, and quiet. Consider blackout curtains and white noise if needed.\n\n**Wind down intentionally** — Start a relaxation routine 30-60 minutes before bed. This might include gentle stretching, reading, or a guided meditation.\n\n**Limit screens** — Blue light from devices can suppress melatonin production. Try to avoid screens at least an hour before bed.`,
  },
  anxiety: {
    keywords: ['anxiety', 'anxious', 'stress', 'stressed', 'worry', 'panic', 'nervous', 'overwhelm', 'calm'],
    text: `Managing anxiety is a journey, and there are many effective techniques you can start using today:\n\n**Box breathing** — Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. This activates your parasympathetic nervous system and signals safety to your brain.\n\n**Ground yourself with 5-4-3-2-1** — Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This brings you back to the present moment.\n\n**Move your body** — Even a short walk can reduce cortisol levels. Gentle movement helps release the physical tension that anxiety creates.\n\n**Name it to tame it** — Simply labeling your emotion ("I'm feeling anxious") can reduce its intensity by activating your prefrontal cortex.`,
  },
  movement: {
    keywords: ['movement', 'exercise', 'stretch', 'yoga', 'walk', 'body', 'physical', 'flexibility', 'morning routine'],
    text: `Mindful movement is about connecting with your body rather than pushing through a workout. Here's how to start:\n\n**Start small** — Even 5-10 minutes of gentle stretching each morning can make a significant difference in how you feel throughout the day.\n\n**Listen to your body** — Pay attention to what feels good and what doesn't. Movement should feel nourishing, not punishing.\n\n**Try different modalities** — Gentle yoga, walking meditation, tai chi, and simple stretching all count. Find what resonates with you.\n\n**Consistency over intensity** — A 10-minute daily practice is more beneficial than an intense hour-long session once a week.`,
  },
  nutrition: {
    keywords: ['nutrition', 'food', 'eat', 'diet', 'meal', 'nourish', 'healthy eating', 'vitamins'],
    text: `Nourishing your body well is foundational to overall wellness. Here are some guiding principles:\n\n**Eat whole, varied foods** — Focus on colorful fruits and vegetables, whole grains, lean proteins, and healthy fats. Variety ensures you get a broad range of nutrients.\n\n**Hydrate consistently** — Aim for 8 glasses of water daily. Dehydration can affect mood, energy, and cognitive function.\n\n**Practice mindful eating** — Slow down, savor your food, and pay attention to hunger and fullness cues. This helps with both digestion and satisfaction.\n\n**Plan ahead** — Weekly meal planning reduces decision fatigue and makes it easier to make nourishing choices throughout the week.`,
  },
  mindfulness: {
    keywords: ['mindfulness', 'meditation', 'meditate', 'breathe', 'breathing', 'present', 'awareness', 'focus', 'journal'],
    text: `Mindfulness is the practice of being fully present in the current moment. Here's how to cultivate it:\n\n**Start with your breath** — Your breath is always available as an anchor to the present moment. Even three conscious breaths can shift your state.\n\n**Practice non-judgment** — When you notice your mind wandering (and it will), gently bring it back without criticism. This is the practice itself.\n\n**Build micro-moments** — You don't need to sit for 30 minutes. Try being fully present while washing dishes, walking, or drinking your morning coffee.\n\n**Try body scanning** — Slowly bring attention to each part of your body from head to toe. This builds interoceptive awareness and helps release held tension.`,
  },
};

function getAIResponse(query: string, allContent: ContentItem[]): Message {
  const q = query.toLowerCase();

  // Find matching topic
  let matchedTopic: string | null = null;
  let bestScore = 0;
  for (const [topic, data] of Object.entries(topicResponses)) {
    const score = data.keywords.filter(kw => q.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      matchedTopic = topic;
    }
  }

  // Find related content
  const relatedContent = allContent
    .filter(item => {
      const matchesQuery = item.title.toLowerCase().includes(q) ||
        item.topics.some(t => t.toLowerCase().includes(q)) ||
        item.description?.toLowerCase().includes(q);
      if (matchedTopic) {
        return matchesQuery || item.topics.some(t => t.toLowerCase() === matchedTopic);
      }
      return matchesQuery;
    })
    .filter(item => item.type !== 'Discussion')
    .slice(0, 4);

  // Find related community discussions
  const relatedCommunity = allContent
    .filter(item => {
      if (item.type !== 'Discussion') return false;
      return item.title.toLowerCase().includes(q) ||
        item.topics.some(t => t.toLowerCase().includes(q)) ||
        (matchedTopic && item.topics.some(t => t.toLowerCase() === matchedTopic));
    })
    .slice(0, 2)
    .map(item => ({
      title: item.title,
      space: item.topics[0] || 'General',
      likes: Math.floor(Math.random() * 20) + 5,
      replies: parseInt(item.duration) || 15,
    }));

  const text = matchedTopic
    ? topicResponses[matchedTopic].text
    : `That's a great question! While I don't have a specific answer prepared for that topic, I can help you explore related content on the Solace platform.\n\nTry asking about specific wellness topics like **sleep**, **anxiety**, **mindfulness**, **movement**, or **nutrition** — I have detailed guidance on each of these areas.\n\nYou can also browse the content library or community discussions for more resources.`;

  return {
    role: 'assistant',
    text,
    content: relatedContent.length > 0 ? relatedContent : undefined,
    community: relatedCommunity.length > 0 ? relatedCommunity : undefined,
  };
}

const suggestedQuestions = [
  'How can I improve my sleep quality?',
  'What are some quick techniques for managing anxiety?',
  'How do I start a mindfulness practice?',
  'What should I know about mindful movement?',
];

function typeToRoute(type: string): string {
  switch (type) {
    case 'Audio': return 'audio';
    case 'Video': return 'video';
    case 'Article': return 'article';
    case 'Program': return 'program';
    case 'Resource': return 'resource';
    default: return 'article';
  }
}

export default function Search() {
  const { content: allContent } = useContent();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const query = text || input.trim();
    if (!query) return;

    const userMsg: Message = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(query, allContent);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!hasMessages) {
    /* Empty state — centered prompt, no chat content */
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 192px)', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="flex flex-col items-center" style={{ gap: 48, width: '100%' }}>
          <h1 className="font-serif" style={{ fontSize: 28, fontWeight: 400, color: '#1a1a1a', textAlign: 'center' }}>
            What would you like to learn about today?
          </h1>

          {/* Search bar (centered) */}
          <div
            className="flex items-center bg-white"
            style={{
              width: '100%',
              border: '1px solid #7a9b7a',
              borderRadius: 42,
              padding: 12,
              gap: 16,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 18,
                fontWeight: 500,
                color: '#222',
                paddingLeft: 16,
                backgroundColor: 'transparent',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="flex items-center justify-center border-none cursor-pointer transition"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: input.trim() ? '#1a1a1a' : '#f0f0f0',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke={input.trim() ? '#fff' : '#999'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Suggested questions */}
          <div className="flex flex-col" style={{ gap: 16, width: '100%' }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>
              Questions to get you started:
            </p>
            <div className="flex flex-col" style={{ gap: 9 }}>
              {suggestedQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left border-none bg-transparent cursor-pointer hover:opacity-70 transition"
                  style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', padding: 0 }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Typing animation keyframes */}
        <style>{`
          @keyframes typingDot {
            0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-4px); }
          }
        `}</style>
      </div>
    );
  }

  /* Chat mode — messages with sticky bottom input */
  return (
    <PageTransition variant="detail" delay={300}>
      <div style={{ maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', paddingBottom: 140 }}>
      {/* Messages */}
      <div className="flex flex-col" style={{ gap: 32 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              /* User bubble — right aligned */
              <div className="flex justify-end">
                <div
                  style={{
                    backgroundColor: '#e8f0e8',
                    borderRadius: 24,
                    padding: '12px 20px',
                    fontSize: 16,
                    fontWeight: 500,
                    color: '#1a1a1a',
                    maxWidth: '80%',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ) : (
              /* Assistant response */
              <div className="flex flex-col" style={{ gap: 32 }}>
                {/* Text response with markdown-like formatting */}
                <div style={{ fontSize: 16, lineHeight: 1.6, color: '#1a1a1a' }}>
                  {msg.text.split('\n').map((line, j) => {
                    if (line.trim() === '') return <br key={j} />;
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={j} style={{ margin: '0 0 4px 0' }}>
                        {parts.map((part, k) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={k}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>

                {/* Suggested content section — platform-style cards */}
                {msg.content && msg.content.length > 0 && (
                  <div className="flex flex-col" style={{ gap: 16 }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', letterSpacing: -0.18 }}>
                      Suggested content
                    </p>
                    <div className="flex overflow-x-auto hide-scrollbar" style={{ gap: 16, paddingBottom: 8 }}>
                      {msg.content.map(item => (
                        <Link
                          key={item.id}
                          to={`/content/${typeToRoute(item.type)}/${item.id}`}
                          className="bg-white rounded-lg overflow-hidden no-underline shrink-0"
                          style={{
                            width: 220,
                            boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.06)',
                            transition: 'box-shadow 0.2s, transform 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0px 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0px 2px 8px 0px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <div style={{ height: 120, backgroundColor: '#ddd', position: 'relative' }}>
                            <span
                              style={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                backgroundColor: 'rgba(38,38,38,0.85)',
                                borderRadius: 4,
                                padding: '3px 7px',
                                fontSize: 11,
                                fontWeight: 500,
                                color: '#fff',
                              }}
                            >
                              {item.type}
                            </span>
                          </div>
                          <div style={{ padding: '10px 12px 14px' }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#222', lineHeight: 1.3, marginBottom: 4 }}>
                              {item.title}
                            </p>
                            <p style={{ fontSize: 12, color: '#8c8c8c' }}>
                              {item.author} · {item.duration}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Community discussions */}
                {msg.community && msg.community.length > 0 && (
                  <div className="flex flex-col" style={{ gap: 16 }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', letterSpacing: -0.18 }}>
                      Community discussions
                    </p>
                    <div className="flex" style={{ gap: 16 }}>
                      {msg.community.map((post, idx) => (
                        <Link
                          key={idx}
                          to="/community"
                          className="flex flex-col no-underline bg-white rounded-lg"
                          style={{
                            gap: 10,
                            width: 260,
                            padding: 16,
                            boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.06)',
                            transition: 'box-shadow 0.2s, transform 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0px 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0px 2px 8px 0px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: '#3d5a3d',
                              backgroundColor: '#e8f0e8',
                              padding: '4px 10px',
                              borderRadius: 999,
                              alignSelf: 'flex-start',
                            }}
                          >
                            {post.space}
                          </span>
                          <p style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#1a1a1a',
                            lineHeight: 1.3,
                          }}>
                            {post.title}
                          </p>
                          <div className="flex items-center" style={{ gap: 12, opacity: 0.5 }}>
                            <div className="flex items-center" style={{ gap: 4 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H4a2 2 0 01-2-2v-8a2 2 0 012-2h2.76a2 2 0 001.79-1.11L12 2h0a3.13 3.13 0 013 3.88z" />
                              </svg>
                              <span style={{ fontSize: 12, color: '#555' }}>{post.likes}</span>
                            </div>
                            <div className="flex items-center" style={{ gap: 4 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                              </svg>
                              <span style={{ fontSize: 12, color: '#555' }}>{post.replies}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center" style={{ gap: 6, padding: '8px 0' }}>
            <div className="flex" style={{ gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#7a9b7a',
                    animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky bottom input bar */}
      <div
        className="fixed flex flex-col items-center"
        style={{
          bottom: 0,
          left: 280,
          right: 0,
          padding: '16px 32px 24px',
          background: 'linear-gradient(transparent, #faf8f5 24px)',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 720, width: '100%' }}>
          <div
            className="flex items-center bg-white"
            style={{
              width: '100%',
              border: '1px solid #7a9b7a',
              borderRadius: 42,
              padding: 12,
              gap: 16,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type something..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 18,
                fontWeight: 500,
                color: '#222',
                paddingLeft: 16,
                backgroundColor: 'transparent',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="flex items-center justify-center border-none cursor-pointer transition"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: input.trim() ? '#1a1a1a' : '#f0f0f0',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke={input.trim() ? '#fff' : '#999'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p style={{ fontSize: 13, color: '#8c8c8c', textAlign: 'center', marginTop: 8 }}>
            Ask Solace only surfaces content that already exists on the platform. Your data is not shared.
          </p>
        </div>
      </div>

      {/* Typing animation keyframes */}
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
      </div>
    </PageTransition>
  );
}
