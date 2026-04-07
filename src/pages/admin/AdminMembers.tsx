import { useToast } from '../../components/Toast';

const mockMembers = [
  { id: '1', name: 'Maya Thompson', email: 'maya@example.com', role: 'Admin', joined: 'Mar 1, 2026', status: 'Active' },
  { id: '2', name: 'Dr. Maya Chen', email: 'maya.chen@solace.com', role: 'Moderator', joined: 'Jan 15, 2026', status: 'Active' },
  { id: '3', name: 'Jordan Rivera', email: 'jordan@example.com', role: 'Moderator', joined: 'Jan 20, 2026', status: 'Active' },
  { id: '4', name: 'Priya K.', email: 'priya@example.com', role: 'Member', joined: 'Feb 5, 2026', status: 'Active' },
  { id: '5', name: 'Marcus T.', email: 'marcus@example.com', role: 'Member', joined: 'Feb 12, 2026', status: 'Active' },
  { id: '6', name: 'Sarah Wells', email: 'sarah.w@example.com', role: 'Member', joined: 'Feb 20, 2026', status: 'Active' },
  { id: '7', name: 'Sarah L.', email: 'sarah.l@example.com', role: 'Member', joined: 'Mar 3, 2026', status: 'Active' },
  { id: '8', name: 'Aisha Patel', email: 'aisha@example.com', role: 'Member', joined: 'Mar 10, 2026', status: 'Active' },
];

const roleColors: Record<string, { bg: string; text: string }> = {
  Admin: { bg: '#3d5a3d', text: '#fff' },
  Moderator: { bg: '#e8f0e8', text: '#3d5a3d' },
  Member: { bg: '#f5f5f5', text: '#555' },
};

export default function AdminMembers() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: 32, color: '#1a1a1a', fontWeight: 400 }}>
            Members
          </h1>
          <p style={{ fontSize: 14, color: '#8c8c8c', marginTop: 4 }}>
            {mockMembers.length} registered members
          </p>
        </div>
        <button
          onClick={() => showToast('Invite sent')}
          className="cursor-pointer border-none hover:opacity-90 transition"
          style={{
            backgroundColor: '#7a9b7a',
            color: '#fff',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          + Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total Members', value: 247 },
          { label: 'Active This Week', value: 183 },
          { label: 'Admins', value: 1 },
          { label: 'Moderators', value: 2 },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg" style={{ padding: 16, border: '1px solid #ebebeb' }}>
            <p style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 500 }}>{stat.label}</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#1a1a1a', marginTop: 2 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #ebebeb' }}>
        <div
          className="hidden md:grid items-center"
          style={{
            gridTemplateColumns: '2fr 2fr 100px 120px 80px',
            padding: '12px 20px',
            borderBottom: '1px solid #ebebeb',
            backgroundColor: '#fafafa',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Joined</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
        </div>

        {mockMembers.map((member) => (
          <div
            key={member.id}
            className="md:grid items-center hover:bg-gray-50 transition-colors cursor-pointer"
            style={{
              gridTemplateColumns: '2fr 2fr 100px 120px 80px',
              padding: '14px 20px',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <div className="flex items-center" style={{ gap: 10 }}>
              <div
                className="rounded-full flex items-center justify-center font-serif shrink-0"
                style={{ width: 32, height: 32, backgroundColor: '#f5f0eb', fontSize: 13, color: '#3d5a3d' }}
              >
                {member.name.charAt(0)}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{member.name}</span>
            </div>
            <span className="hidden md:block truncate" style={{ fontSize: 13, color: '#555' }}>{member.email}</span>
            <div className="hidden md:block">
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 4,
                  backgroundColor: roleColors[member.role].bg,
                  color: roleColors[member.role].text,
                }}
              >
                {member.role}
              </span>
            </div>
            <span className="hidden md:block" style={{ fontSize: 13, color: '#555' }}>{member.joined}</span>
            <span className="hidden md:block" style={{ fontSize: 12, color: '#7a9b7a', fontWeight: 500 }}>{member.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
