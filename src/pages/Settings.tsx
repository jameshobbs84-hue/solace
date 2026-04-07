import { useUser } from '../context/UserContext';
import { useToast } from '../components/Toast';
import PageTransition from '../components/PageTransition';

export default function Settings() {
  const { user, setOnboardingData } = useUser();
  const { showToast } = useToast();

  return (
    <PageTransition variant="settings">
      <div className="flex flex-col" style={{ gap: '40px' }}>
      <h1
        className="font-serif"
        style={{ fontSize: '40px', color: '#1a1a1a', fontWeight: 400 }}
      >
        Account Settings
      </h1>

      {/* Profile section */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Profile</h2>

        <div className="flex items-center" style={{ gap: '16px', marginTop: '20px' }}>
          <div
            className="rounded-full flex items-center justify-center font-serif"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#f5f0eb',
              fontSize: '24px',
              color: '#3d5a3d',
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#222' }}>{user.name}</p>
            <p style={{ fontSize: '14px', color: '#8c8c8c' }}>maya@example.com</p>
          </div>
        </div>

        <div className="flex" style={{ gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div>
            <label className="block" style={{ fontSize: '13px', fontWeight: 500, color: '#555', marginBottom: '8px' }}>
              First name
            </label>
            <input
              type="text"
              defaultValue={user.name}
              style={{
                width: '100%',
                maxWidth: '480px',
                height: '48px',
                padding: '0 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#fff',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label className="block" style={{ fontSize: '13px', fontWeight: 500, color: '#555', marginBottom: '8px' }}>
              Last name
            </label>
            <input
              type="text"
              defaultValue="Thompson"
              style={{
                width: '100%',
                maxWidth: '480px',
                height: '48px',
                padding: '0 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#fff',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label className="block" style={{ fontSize: '13px', fontWeight: 500, color: '#555', marginBottom: '8px' }}>
            Email
          </label>
          <input
            type="email"
            defaultValue="maya@example.com"
            style={{
              width: '480px',
              maxWidth: '100%',
              height: '48px',
              padding: '0 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              backgroundColor: '#fff',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #d1d1d1' }} />

      {/* Preferences section */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Preferences</h2>

        <div style={{ marginTop: '20px' }}>
          <label className="block" style={{ fontSize: '13px', fontWeight: 500, color: '#555', marginBottom: '8px' }}>
            Wellness stage
          </label>
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {['Just starting out', 'Finding my footing', 'Ready to go deeper'].map((stage) => (
              <span
                key={stage}
                onClick={() => setOnboardingData({ stage })}
                className="cursor-pointer transition"
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: user.stage === stage ? '#7a9b7a' : '#fff',
                  color: user.stage === stage ? '#fff' : '#222',
                  border: user.stage === stage ? 'none' : '1px solid #ebebeb',
                }}
              >
                {stage}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label className="block" style={{ fontSize: '13px', fontWeight: 500, color: '#555', marginBottom: '8px' }}>
            Focus areas
          </label>
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {['Sleep', 'Anxiety', 'Movement', 'Relationships', 'Nutrition', 'Mindfulness'].map((area) => (
              <span
                key={area}
                onClick={() => {
                  const current = user.focusAreas;
                  const updated = current.includes(area)
                    ? current.filter(a => a !== area)
                    : [...current, area];
                  setOnboardingData({ focusAreas: updated });
                }}
                className="cursor-pointer transition"
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: user.focusAreas.includes(area) ? '#7a9b7a' : '#fff',
                  color: user.focusAreas.includes(area) ? '#fff' : '#222',
                  border: user.focusAreas.includes(area) ? 'none' : '1px solid #ebebeb',
                }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label className="block" style={{ fontSize: '13px', fontWeight: 500, color: '#555', marginBottom: '8px' }}>
            Content preference
          </label>
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {['Video', 'Audio', 'Reading', 'A mix of everything'].map((pref) => (
              <span
                key={pref}
                onClick={() => setOnboardingData({ contentPreference: pref })}
                className="cursor-pointer transition"
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: user.contentPreference === pref ? '#7a9b7a' : '#fff',
                  color: user.contentPreference === pref ? '#fff' : '#222',
                  border: user.contentPreference === pref ? 'none' : '1px solid #ebebeb',
                }}
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #d1d1d1' }} />

      {/* Notifications section */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Notifications</h2>
        <div style={{ marginTop: '20px' }}>
          {[
            { label: 'Email notifications', desc: 'Receive updates about new content and events' },
            { label: 'Community alerts', desc: 'Get notified about replies to your posts' },
            { label: 'Event reminders', desc: 'Receive reminders before events you\'ve RSVP\'d to' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between" style={{ padding: '12px 0' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#222' }}>{item.label}</p>
                <p style={{ fontSize: '13px', color: '#8c8c8c' }}>{item.desc}</p>
              </div>
              <div
                className="relative cursor-pointer"
                style={{
                  width: '40px',
                  height: '24px',
                  backgroundColor: '#7a9b7a',
                  borderRadius: '9999px',
                }}
              >
                <div
                  className="absolute"
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#fff',
                    borderRadius: '9999px',
                    right: '4px',
                    top: '4px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={() => showToast('Preferences saved')}
          className="cursor-pointer hover:opacity-90 transition"
          style={{
            backgroundColor: '#7a9b7a',
            color: '#fff',
            fontWeight: 600,
            padding: '12px 24px',
            borderRadius: '9999px',
            fontSize: '16px',
            border: 'none',
          }}
        >
          Save changes
        </button>
      </div>
      </div>
    </PageTransition>
  );
}
