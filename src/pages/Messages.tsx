import { useState, useRef, useEffect, useCallback } from 'react';
import { SkeletonBlock, SkeletonText } from '../components/PageTransition';

/* ── Types ── */
interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  participants: string[];
  avatar?: string;
  isGroup: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  online?: boolean;
  messages: Message[];
}

/* ── Contact directory (available people to message) ── */
interface Contact {
  id: string;
  name: string;
  role: string;
  online?: boolean;
}

const contacts: Contact[] = [
  { id: 'maya-chen', name: 'Dr. Maya Chen', role: 'Wellness Coach', online: true },
  { id: 'jordan-rivera', name: 'Jordan Rivera', role: 'Community Member' },
  { id: 'aisha-patel', name: 'Aisha Patel', role: 'Nutrition Specialist', online: true },
  { id: 'sarah-wells', name: 'Sarah Wells', role: 'Community Member' },
  { id: 'liam-brooks', name: 'Liam Brooks', role: 'Meditation Instructor', online: true },
  { id: 'emma-harris', name: 'Emma Harris', role: 'Community Member' },
  { id: 'noah-wilson', name: 'Noah Wilson', role: 'Sleep Specialist' },
  { id: 'olivia-martinez', name: 'Olivia Martinez', role: 'Community Member', online: true },
];

/* ── Seed data ── */
const seedConversations: Conversation[] = [
  {
    id: '1',
    name: 'Dr. Maya Chen',
    participants: ['maya-chen'],
    isGroup: false,
    lastMessage: 'Great progress on your sleep journal! Let\'s review your entries in our next session.',
    lastMessageTime: 'Today',
    unread: true,
    online: true,
    messages: [
      { id: '1a', senderId: 'maya-chen', text: 'Hi! I wanted to check in on how the Sleep Reset program is going for you.', time: '10:15 AM' },
      { id: '1b', senderId: 'me', text: 'It\'s been really helpful! I\'ve noticed a big difference in my evening routine.', time: '10:22 AM' },
      { id: '1c', senderId: 'maya-chen', text: 'That\'s wonderful to hear. Have you been keeping up with the sleep journal?', time: '10:24 AM' },
      { id: '1d', senderId: 'me', text: 'Yes, every night for the past week! It\'s become a habit now.', time: '10:30 AM' },
      { id: '1e', senderId: 'maya-chen', text: 'Great progress on your sleep journal! Let\'s review your entries in our next session.', time: '10:32 AM' },
    ],
  },
  {
    id: '2',
    name: 'Jordan Rivera',
    participants: ['jordan-rivera'],
    isGroup: false,
    lastMessage: 'The morning stretch video was exactly what I needed. Any more like that?',
    lastMessageTime: 'Yesterday',
    unread: false,
    messages: [
      { id: '2a', senderId: 'jordan-rivera', text: 'Hey! Saw you completed the Movement for Anxiety Relief program 🎉', time: 'Yesterday' },
      { id: '2b', senderId: 'me', text: 'Yes! Loved it. The breathing exercises combined with movement were great.', time: 'Yesterday' },
      { id: '2c', senderId: 'jordan-rivera', text: 'So glad to hear that! Have you tried the Gentle Morning Stretch video?', time: 'Yesterday' },
      { id: '2d', senderId: 'me', text: 'The morning stretch video was exactly what I needed. Any more like that?', time: 'Yesterday' },
    ],
  },
  {
    id: '3',
    name: 'Mindfulness Circle',
    participants: ['maya-chen', 'jordan-rivera', 'aisha-patel'],
    isGroup: true,
    lastMessage: 'Aisha: Has anyone tried the new walking meditation audio?',
    lastMessageTime: 'Wednesday',
    unread: false,
    messages: [
      { id: '3a', senderId: 'maya-chen', text: 'Welcome to the Mindfulness Circle group chat! Feel free to share tips and experiences here.', time: 'Monday' },
      { id: '3b', senderId: 'jordan-rivera', text: 'Great idea setting this up! I\'ve been wanting a space to share daily practices.', time: 'Monday' },
      { id: '3c', senderId: 'me', text: 'Thanks for adding me! Looking forward to learning from everyone.', time: 'Tuesday' },
      { id: '3d', senderId: 'aisha-patel', text: 'Has anyone tried the new walking meditation audio?', time: 'Wednesday' },
    ],
  },
  {
    id: '4',
    name: 'Aisha Patel',
    participants: ['aisha-patel'],
    isGroup: false,
    lastMessage: 'I\'ll send you the updated meal planning template tomorrow!',
    lastMessageTime: 'Monday',
    unread: false,
    online: true,
    messages: [
      { id: '4a', senderId: 'me', text: 'Hi Aisha! I loved the Nourish program. Do you have a downloadable meal plan?', time: 'Monday' },
      { id: '4b', senderId: 'aisha-patel', text: 'Thank you! Yes, I\'m actually updating it right now with some new seasonal recipes.', time: 'Monday' },
      { id: '4c', senderId: 'aisha-patel', text: 'I\'ll send you the updated meal planning template tomorrow!', time: 'Monday' },
    ],
  },
  {
    id: '5',
    name: 'Sleep Support Group',
    participants: ['maya-chen', 'sarah-wells'],
    isGroup: true,
    lastMessage: 'Sarah: The mountain lake sleep story really helped me last night.',
    lastMessageTime: 'Last week',
    unread: false,
    messages: [
      { id: '5a', senderId: 'maya-chen', text: 'This is a space for everyone working through the Sleep Reset program. Share what\'s working!', time: 'Last week' },
      { id: '5b', senderId: 'sarah-wells', text: 'The mountain lake sleep story really helped me last night.', time: 'Last week' },
    ],
  },
];

const nameInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0];
};

const avatarColors: Record<string, string> = {
  'Dr. Maya Chen': '#e8f0e8',
  'Jordan Rivera': '#f0e8e8',
  'Aisha Patel': '#e8e8f0',
  'Sarah Wells': '#f0ece8',
  'Liam Brooks': '#e8f0e8',
  'Emma Harris': '#f0e8e8',
  'Noah Wilson': '#e8ecf0',
  'Olivia Martinez': '#f0ece8',
  'Mindfulness Circle': '#e8f0e8',
  'Sleep Support Group': '#e8ecf0',
};

function formatNow(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

let nextId = 100;
function uid() {
  return String(++nextId);
}

/* ── Components ── */

function InboxRow({
  convo,
  isActive,
  onClick,
}: {
  convo: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-start w-full border-none cursor-pointer text-left transition-colors"
      style={{
        padding: '16px 20px',
        gap: 12,
        backgroundColor: isActive ? '#f5f0eb' : hovered ? '#faf8f5' : 'transparent',
        borderLeft: isActive ? '3px solid #7a9b7a' : '3px solid transparent',
      }}
    >
      {/* Avatar */}
      <div
        className="rounded-full flex items-center justify-center shrink-0 font-semibold relative"
        style={{
          width: 44,
          height: 44,
          backgroundColor: avatarColors[convo.name] || '#f0ece8',
          fontSize: 14,
          color: '#3d5a3d',
        }}
      >
        {convo.isGroup ? (
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <path d="M6.75 11.25C8.82107 11.25 10.5 9.57107 10.5 7.5C10.5 5.42893 8.82107 3.75 6.75 3.75C4.67893 3.75 3 5.42893 3 7.5C3 9.57107 4.67893 11.25 6.75 11.25Z" stroke="#3d5a3d" strokeWidth="1.2" />
            <path d="M12 3.93C13.07 4.46 13.8 5.59 13.8 6.9C13.8 8.21 13.07 9.34 12 9.87" stroke="#3d5a3d" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M1.5 14.25C1.5 12.45 3.85 11.25 6.75 11.25C9.65 11.25 12 12.45 12 14.25" stroke="#3d5a3d" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M12 11.25C14.08 11.25 15.75 12.17 15.75 13.5" stroke="#3d5a3d" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        ) : (
          nameInitials(convo.name)
        )}
        {convo.online && !convo.isGroup && (
          <div
            className="absolute rounded-full"
            style={{
              width: 10,
              height: 10,
              backgroundColor: '#4caf50',
              border: '2px solid #fff',
              bottom: 0,
              right: 0,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0" style={{ gap: 2 }}>
        <div className="flex items-center justify-between">
          <span
            className="truncate"
            style={{
              fontSize: 14,
              fontWeight: convo.unread ? 700 : 500,
              color: '#1a1a1a',
              fontVariationSettings: "'opsz' 14",
            }}
          >
            {convo.name}
          </span>
          <span
            className="shrink-0"
            style={{
              fontSize: 12,
              color: convo.unread ? '#3d5a3d' : '#999',
              fontWeight: convo.unread ? 600 : 400,
              marginLeft: 8,
            }}
          >
            {convo.lastMessageTime}
          </span>
        </div>
        <p
          className="truncate"
          style={{
            fontSize: 13,
            color: convo.unread ? '#555' : '#999',
            fontWeight: convo.unread ? 500 : 400,
            marginTop: 2,
            lineHeight: '18px',
          }}
        >
          {convo.lastMessage}
        </p>
      </div>

      {/* Unread indicator */}
      {convo.unread && (
        <div
          className="rounded-full shrink-0 self-center"
          style={{ width: 8, height: 8, backgroundColor: '#7a9b7a' }}
        />
      )}
    </button>
  );
}

function ChatBubble({ message, isMe }: { message: Message; isMe: boolean }) {
  return (
    <div className="flex flex-col" style={{ alignItems: isMe ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '70%',
          padding: '10px 16px',
          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: isMe ? '#3d5a3d' : '#fff',
          color: isMe ? '#fff' : '#1a1a1a',
          fontSize: 14,
          lineHeight: '22px',
          border: isMe ? 'none' : '1px solid #ebebeb',
          fontVariationSettings: "'opsz' 14",
        }}
      >
        {message.text}
      </div>
      <span style={{ fontSize: 11, color: '#999', marginTop: 4, paddingLeft: 4, paddingRight: 4 }}>
        {message.time}
      </span>
    </div>
  );
}

function ChatThread({
  convo,
  onBack,
  onSendMessage,
}: {
  convo: Conversation;
  onBack: () => void;
  onSendMessage: (convoId: string, text: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [convo.messages.length, scrollToBottom]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    onSendMessage(convo.id, text);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center shrink-0"
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #ebebeb',
          gap: 12,
        }}
      >
        <button
          onClick={onBack}
          className="border-none bg-transparent cursor-pointer md:hidden"
          style={{ padding: 0, fontSize: 18, color: '#555' }}
        >
          ←
        </button>
        <div
          className="rounded-full flex items-center justify-center shrink-0 font-semibold"
          style={{
            width: 36,
            height: 36,
            backgroundColor: avatarColors[convo.name] || '#f0ece8',
            fontSize: 13,
            color: '#3d5a3d',
          }}
        >
          {convo.isGroup ? (
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M6.75 11.25C8.82107 11.25 10.5 9.57107 10.5 7.5C10.5 5.42893 8.82107 3.75 6.75 3.75C4.67893 3.75 3 5.42893 3 7.5C3 9.57107 4.67893 11.25 6.75 11.25Z" stroke="#3d5a3d" strokeWidth="1.2" />
              <path d="M12 3.93C13.07 4.46 13.8 5.59 13.8 6.9C13.8 8.21 13.07 9.34 12 9.87" stroke="#3d5a3d" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M1.5 14.25C1.5 12.45 3.85 11.25 6.75 11.25C9.65 11.25 12 12.45 12 14.25" stroke="#3d5a3d" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M12 11.25C14.08 11.25 15.75 12.17 15.75 13.5" stroke="#3d5a3d" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          ) : (
            nameInitials(convo.name)
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold" style={{ fontSize: 15, color: '#1a1a1a', fontVariationSettings: "'opsz' 14" }}>
            {convo.name}
          </span>
          {convo.isGroup && (
            <span style={{ fontSize: 12, color: '#999' }}>
              {convo.participants.length + 1} members
            </span>
          )}
          {!convo.isGroup && convo.online && (
            <span style={{ fontSize: 12, color: '#4caf50' }}>Online</span>
          )}
        </div>
        <div className="flex-1" />
        <button
          className="border-none bg-transparent cursor-pointer"
          style={{ padding: 4, color: '#999', fontSize: 20 }}
        >
          ···
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ padding: 24, gap: 16 }}
      >
        {convo.messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} isMe={msg.senderId === 'me'} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Compose */}
      <div
        className="shrink-0"
        style={{
          padding: '16px 24px',
          borderTop: '1px solid #ebebeb',
        }}
      >
        <div
          className="flex items-end bg-white"
          style={{
            border: '1px solid #d1d1d1',
            borderRadius: 12,
            padding: '8px 12px',
            gap: 8,
          }}
        >
          <button
            className="border-none bg-transparent cursor-pointer shrink-0"
            style={{ padding: 4, color: '#999' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="6.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 13L6 9.5L8.5 12L11.5 8L16 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Write a message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-none outline-none bg-transparent"
            style={{
              fontSize: 14,
              color: '#1a1a1a',
              fontVariationSettings: "'opsz' 14",
              padding: '4px 0',
            }}
          />
          <button
            onClick={handleSend}
            className="border-none cursor-pointer shrink-0 font-semibold transition-opacity"
            style={{
              backgroundColor: draft.trim() ? '#3d5a3d' : '#d1d1d1',
              color: '#fff',
              fontSize: 13,
              padding: '6px 16px',
              borderRadius: 20,
              fontVariationSettings: "'opsz' 14",
              opacity: draft.trim() ? 1 : 0.6,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── New Message Modal ── */
function NewMessageModal({
  onClose,
  onCreateConversation,
  existingConversations,
}: {
  onClose: () => void;
  onCreateConversation: (selected: Contact[], groupName: string) => void;
  existingConversations: Conversation[];
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Contact[]>([]);
  const [groupName, setGroupName] = useState('');
  const [step, setStep] = useState<'select' | 'group-name'>('select');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const isGroup = selected.length > 1;

  const filteredContacts = contacts.filter((c) => {
    if (!search.trim()) return true;
    return c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
  });

  const toggleContact = (contact: Contact) => {
    setSelected((prev) =>
      prev.find((c) => c.id === contact.id)
        ? prev.filter((c) => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    if (isGroup) {
      setStep('group-name');
    } else {
      // DM — check if conversation already exists
      const existing = existingConversations.find(
        (c) => !c.isGroup && c.participants.includes(selected[0].id)
      );
      if (existing) {
        // Just open existing
        onCreateConversation(selected, '');
      } else {
        onCreateConversation(selected, '');
      }
    }
  };

  const handleCreate = () => {
    if (isGroup && !groupName.trim()) return;
    onCreateConversation(selected, groupName.trim());
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={onClose}
    >
      <div
        className="bg-white flex flex-col w-[calc(100%-32px)] md:w-[440px]"
        style={{
          maxHeight: 560,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{ padding: '20px 24px 16px', borderBottom: '1px solid #ebebeb' }}
        >
          <h2 className="font-serif" style={{ fontSize: 22, fontWeight: 400, color: '#1a1a1a' }}>
            {step === 'select' ? 'New message' : 'Name your group'}
          </h2>
          <button
            onClick={onClose}
            className="border-none bg-transparent cursor-pointer"
            style={{ padding: 4, fontSize: 18, color: '#999' }}
          >
            ✕
          </button>
        </div>

        {step === 'select' && (
          <>
            {/* Selected chips */}
            {selected.length > 0 && (
              <div className="flex flex-wrap shrink-0" style={{ padding: '12px 24px 0', gap: 8 }}>
                {selected.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleContact(c)}
                    className="flex items-center border-none cursor-pointer"
                    style={{
                      backgroundColor: '#e8f0e8',
                      borderRadius: 20,
                      padding: '4px 12px 4px 10px',
                      fontSize: 13,
                      color: '#3d5a3d',
                      fontWeight: 500,
                      gap: 6,
                      fontVariationSettings: "'opsz' 14",
                    }}
                  >
                    {c.name}
                    <span style={{ fontSize: 11, opacity: 0.7 }}>✕</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="shrink-0" style={{ padding: '12px 24px' }}>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-none outline-none bg-transparent"
                style={{
                  fontSize: 15,
                  color: '#1a1a1a',
                  padding: '8px 0',
                  borderBottom: '1px solid #ebebeb',
                  fontVariationSettings: "'opsz' 14",
                }}
              />
            </div>

            {/* Contact list */}
            <div className="flex-1 overflow-y-auto" style={{ padding: '0 12px 12px' }}>
              {filteredContacts.map((contact) => {
                const isSelected = selected.some((c) => c.id === contact.id);
                return (
                  <button
                    key={contact.id}
                    onClick={() => toggleContact(contact)}
                    className="flex items-center w-full border-none cursor-pointer text-left transition-colors"
                    style={{
                      padding: '10px 12px',
                      gap: 12,
                      borderRadius: 10,
                      backgroundColor: isSelected ? '#f5f0eb' : 'transparent',
                    }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center shrink-0 font-semibold relative"
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: avatarColors[contact.name] || '#f0ece8',
                        fontSize: 13,
                        color: '#3d5a3d',
                      }}
                    >
                      {nameInitials(contact.name)}
                      {contact.online && (
                        <div
                          className="absolute rounded-full"
                          style={{
                            width: 9,
                            height: 9,
                            backgroundColor: '#4caf50',
                            border: '2px solid #fff',
                            bottom: 0,
                            right: 0,
                          }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span
                        className="truncate"
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#1a1a1a',
                          fontVariationSettings: "'opsz' 14",
                        }}
                      >
                        {contact.name}
                      </span>
                      <span style={{ fontSize: 12, color: '#999' }}>{contact.role}</span>
                    </div>
                    {/* Checkbox */}
                    <div
                      className="shrink-0 rounded flex items-center justify-center"
                      style={{
                        width: 20,
                        height: 20,
                        border: isSelected ? 'none' : '1.5px solid #d1d1d1',
                        backgroundColor: isSelected ? '#3d5a3d' : '#fff',
                        borderRadius: 5,
                      }}
                    >
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredContacts.length === 0 && (
                <p style={{ padding: 20, fontSize: 14, color: '#999', textAlign: 'center' }}>
                  No contacts found
                </p>
              )}
            </div>

            {/* Footer */}
            <div
              className="shrink-0 flex justify-end"
              style={{ padding: '12px 24px 20px', gap: 12, borderTop: '1px solid #ebebeb' }}
            >
              <button
                onClick={onClose}
                className="border-none cursor-pointer"
                style={{
                  backgroundColor: 'transparent',
                  fontSize: 14,
                  color: '#555',
                  padding: '8px 20px',
                  borderRadius: 20,
                  fontWeight: 500,
                  fontVariationSettings: "'opsz' 14",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="border-none cursor-pointer font-semibold transition-opacity"
                style={{
                  backgroundColor: selected.length > 0 ? '#3d5a3d' : '#d1d1d1',
                  color: '#fff',
                  fontSize: 14,
                  padding: '8px 24px',
                  borderRadius: 20,
                  opacity: selected.length > 0 ? 1 : 0.6,
                  fontVariationSettings: "'opsz' 14",
                }}
              >
                {isGroup ? 'Next' : 'Start chat'}
              </button>
            </div>
          </>
        )}

        {step === 'group-name' && (
          <>
            <div className="flex-1 flex flex-col" style={{ padding: 24, gap: 16 }}>
              <p style={{ fontSize: 14, color: '#555', fontVariationSettings: "'opsz' 14" }}>
                Choose a name for your group with {selected.map((c) => c.name.split(' ')[0]).join(', ')}
              </p>
              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                autoFocus
                className="w-full border-none outline-none"
                style={{
                  fontSize: 16,
                  color: '#1a1a1a',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid #d1d1d1',
                  backgroundColor: '#fff',
                  fontVariationSettings: "'opsz' 14",
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && groupName.trim()) handleCreate();
                }}
              />
              {/* Preview of selected members */}
              <div className="flex flex-wrap" style={{ gap: 8, marginTop: 4 }}>
                {selected.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center"
                    style={{
                      backgroundColor: '#f5f0eb',
                      borderRadius: 20,
                      padding: '4px 12px',
                      fontSize: 13,
                      color: '#555',
                      gap: 6,
                      fontVariationSettings: "'opsz' 14",
                    }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center font-semibold"
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: avatarColors[c.name] || '#f0ece8',
                        fontSize: 9,
                        color: '#3d5a3d',
                      }}
                    >
                      {nameInitials(c.name)}
                    </div>
                    {c.name}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="shrink-0 flex justify-between"
              style={{ padding: '12px 24px 20px', borderTop: '1px solid #ebebeb' }}
            >
              <button
                onClick={() => setStep('select')}
                className="border-none cursor-pointer"
                style={{
                  backgroundColor: 'transparent',
                  fontSize: 14,
                  color: '#555',
                  padding: '8px 20px',
                  borderRadius: 20,
                  fontWeight: 500,
                  fontVariationSettings: "'opsz' 14",
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleCreate}
                className="border-none cursor-pointer font-semibold transition-opacity"
                style={{
                  backgroundColor: groupName.trim() ? '#3d5a3d' : '#d1d1d1',
                  color: '#fff',
                  fontSize: 14,
                  padding: '8px 24px',
                  borderRadius: 20,
                  opacity: groupName.trim() ? 1 : 0.6,
                  fontVariationSettings: "'opsz' 14",
                }}
              >
                Create group
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Messages() {
  const [conversationList, setConversationList] = useState<Conversation[]>(seedConversations);
  const [activeConvoId, setActiveConvoId] = useState<string | null>('1');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const activeConvo = conversationList.find((c) => c.id === activeConvoId) || null;

  const handleSendMessage = useCallback((convoId: string, text: string) => {
    const time = formatNow();
    const newMsg: Message = { id: uid(), senderId: 'me', text, time };

    setConversationList((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== convoId) return c;
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: text,
          lastMessageTime: 'Just now',
          unread: false,
        };
      });
      // Move this conversation to top
      const idx = updated.findIndex((c) => c.id === convoId);
      if (idx > 0) {
        const [moved] = updated.splice(idx, 1);
        updated.unshift(moved);
      }
      return updated;
    });
  }, []);

  const handleCreateConversation = useCallback((selected: Contact[], groupName: string) => {
    const isGroup = selected.length > 1;

    // For DMs, check if conversation already exists
    if (!isGroup) {
      const existing = conversationList.find(
        (c) => !c.isGroup && c.participants.includes(selected[0].id)
      );
      if (existing) {
        setActiveConvoId(existing.id);
        setShowNewMessage(false);
        return;
      }
    }

    const newConvo: Conversation = {
      id: uid(),
      name: isGroup ? groupName : selected[0].name,
      participants: selected.map((c) => c.id),
      isGroup,
      lastMessage: '',
      lastMessageTime: 'Just now',
      unread: false,
      online: !isGroup ? selected[0].online : undefined,
      messages: [],
    };

    setConversationList((prev) => [newConvo, ...prev]);
    setActiveConvoId(newConvo.id);
    setShowNewMessage(false);
  }, [conversationList]);

  if (loading) {
    return (
      <div
        className="fixed top-0 right-0 left-0 md:left-[280px] bottom-[88px] md:bottom-0 flex overflow-hidden"
      >
        {/* Inbox skeleton */}
        <div className="flex flex-col shrink-0 bg-white w-full md:w-[340px]" style={{ borderRight: '1px solid #ebebeb', height: '100%' }}>
          <div style={{ padding: '24px 24px 16px 24px' }}>
            <SkeletonText width={120} height={28} />
          </div>
          <div className="flex flex-col" style={{ gap: 0 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center" style={{ padding: '14px 24px', gap: 12 }}>
                <SkeletonBlock width={44} height={44} radius={999} />
                <div className="flex-1 flex flex-col" style={{ gap: 6 }}>
                  <SkeletonText width="60%" height={14} />
                  <SkeletonText width="85%" height={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat skeleton — hidden on mobile */}
        <div className="flex-1 hidden md:flex flex-col" style={{ backgroundColor: '#faf8f5' }}>
          <div className="flex items-center shrink-0" style={{ padding: '16px 24px', borderBottom: '1px solid #ebebeb', gap: 12, backgroundColor: '#fff' }}>
            <SkeletonBlock width={36} height={36} radius={999} />
            <SkeletonText width={140} height={16} />
          </div>
          <div className="flex-1 flex flex-col justify-end" style={{ padding: 24, gap: 16 }}>
            <div className="flex justify-start"><SkeletonBlock width={220} height={44} radius={16} /></div>
            <div className="flex justify-end"><SkeletonBlock width={180} height={44} radius={16} /></div>
            <div className="flex justify-start"><SkeletonBlock width={260} height={44} radius={16} /></div>
          </div>
          <div style={{ padding: '12px 24px 24px', borderTop: '1px solid #ebebeb', backgroundColor: '#fff' }}>
            <SkeletonBlock width="100%" height={44} radius={22} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed top-0 right-0 left-0 md:left-[280px] bottom-[88px] md:bottom-0 flex overflow-hidden page-fade-in"
      >
        {/* Left panel — Inbox list (full-width on mobile, hidden when chat is open) */}
        <div
          className={`flex-col shrink-0 bg-white w-full md:w-[340px] ${activeConvoId ? 'hidden md:flex' : 'flex'}`}
          style={{
            borderRight: '1px solid #ebebeb',
            height: '100%',
          }}
        >
          {/* Inbox header */}
          <div
            className="flex items-center justify-between shrink-0"
            style={{ padding: '24px 24px 16px 24px' }}
          >
            <h1 className="font-serif" style={{ fontSize: 28, color: '#1a1a1a', fontWeight: 400 }}>
              Messages
            </h1>
            <button
              onClick={() => setShowNewMessage(true)}
              className="border-none bg-transparent cursor-pointer hover:opacity-70 transition"
              style={{ padding: 4, color: '#555' }}
              title="New message"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.5 2.5L17.5 5.5M14.5 2.5L6 11L5 15L9 14L17.5 5.5L14.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {conversationList.map((convo) => (
              <InboxRow
                key={convo.id}
                convo={convo}
                isActive={activeConvoId === convo.id}
                onClick={() => {
                  setActiveConvoId(convo.id);
                  // Mark as read
                  if (convo.unread) {
                    setConversationList((prev) =>
                      prev.map((c) => (c.id === convo.id ? { ...c, unread: false } : c))
                    );
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Right panel — Chat thread (hidden on mobile when no convo selected) */}
        <div className={`flex-1 flex-col min-w-0 ${activeConvoId ? 'flex' : 'hidden md:flex'}`}>
          {activeConvo ? (
            <ChatThread
              convo={activeConvo}
              onBack={() => setActiveConvoId(null)}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center" style={{ gap: 8 }}>
              <svg width="48" height="48" viewBox="0 0 18 18" fill="none" style={{ color: '#d1d1d1' }}>
                <path d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 10.1596 2.54158 11.2527 3.05469 12.2109L2.25 15.75L5.78906 14.9453C6.74722 15.4584 7.84042 15.75 9 15.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.375 8.25H11.625M6.375 10.5H9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="font-semibold" style={{ fontSize: 16, color: '#222' }}>Select a conversation</p>
              <p style={{ fontSize: 14, color: '#8c8c8c' }}>Choose a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <NewMessageModal
          onClose={() => setShowNewMessage(false)}
          onCreateConversation={(selected, groupName) => {
            handleCreateConversation(selected, groupName);
          }}
          existingConversations={conversationList}
        />
      )}
    </>
  );
}
