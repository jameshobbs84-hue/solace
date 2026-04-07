import { useToast } from '../../components/Toast';

export default function AdminSettings() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col" style={{ gap: 32 }}>
      <div>
        <h1 className="font-serif" style={{ fontSize: 32, color: '#1a1a1a', fontWeight: 400 }}>
          Platform Settings
        </h1>
        <p style={{ fontSize: 14, color: '#8c8c8c', marginTop: 4 }}>
          Configure your Solace platform settings and preferences.
        </p>
      </div>

      {/* General settings */}
      <div className="bg-white rounded-xl" style={{ border: '1px solid #ebebeb', padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 20 }}>General</h2>
        <div className="flex flex-col" style={{ gap: 16 }}>
          <div>
            <label className="block" style={{ fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 8 }}>
              Platform Name
            </label>
            <input
              type="text"
              defaultValue="Solace"
              style={{
                width: '100%',
                maxWidth: 400,
                height: 40,
                padding: '0 14px',
                border: '1px solid #ddd',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label className="block" style={{ fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 8 }}>
              Platform Description
            </label>
            <textarea
              defaultValue="A wellness education membership platform focused on sleep, anxiety, movement, and nutrition."
              style={{
                width: '100%',
                maxWidth: 500,
                minHeight: 80,
                padding: '10px 14px',
                border: '1px solid #ddd',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="bg-white rounded-xl" style={{ border: '1px solid #ebebeb', padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 20 }}>Branding</h2>
        <div className="flex flex-col" style={{ gap: 16 }}>
          <div>
            <label className="block" style={{ fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 8 }}>
              Primary Color
            </label>
            <div className="flex items-center" style={{ gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#7a9b7a', border: '1px solid #ebebeb' }} />
              <input
                type="text"
                defaultValue="#7a9b7a"
                style={{
                  width: 120,
                  height: 40,
                  padding: '0 14px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'monospace',
                }}
              />
            </div>
          </div>
          <div>
            <label className="block" style={{ fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 8 }}>
              Background Color
            </label>
            <div className="flex items-center" style={{ gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#faf8f5', border: '1px solid #ebebeb' }} />
              <input
                type="text"
                defaultValue="#faf8f5"
                style={{
                  width: 120,
                  height: 40,
                  padding: '0 14px',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'monospace',
                }}
              />
            </div>
          </div>
          <div>
            <label className="block" style={{ fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 8 }}>
              Logo
            </label>
            <div
              className="flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
              style={{
                width: 200,
                height: 80,
                border: '2px dashed #ddd',
                borderRadius: 8,
                fontSize: 13,
                color: '#999',
              }}
            >
              Upload logo
            </div>
          </div>
        </div>
      </div>

      {/* Community settings */}
      <div className="bg-white rounded-xl" style={{ border: '1px solid #ebebeb', padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 20 }}>Community</h2>
        <div className="flex flex-col" style={{ gap: 12 }}>
          {[
            { label: 'Allow new member posts', desc: 'New members can create posts immediately', enabled: true },
            { label: 'Require post approval', desc: 'All posts must be approved by a moderator', enabled: false },
            { label: 'Enable reactions', desc: 'Members can react to posts and replies', enabled: true },
            { label: 'Enable direct messages', desc: 'Members can send private messages to each other', enabled: true },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between" style={{ padding: '10px 0' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{setting.label}</p>
                <p style={{ fontSize: 12, color: '#8c8c8c' }}>{setting.desc}</p>
              </div>
              <div
                className="relative cursor-pointer shrink-0"
                style={{
                  width: 40,
                  height: 24,
                  backgroundColor: setting.enabled ? '#7a9b7a' : '#ddd',
                  borderRadius: 9999,
                }}
              >
                <div
                  className="absolute"
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: '#fff',
                    borderRadius: 9999,
                    top: 4,
                    ...(setting.enabled ? { right: 4 } : { left: 4 }),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={() => showToast('Settings saved')}
          className="cursor-pointer border-none hover:opacity-90 transition"
          style={{
            backgroundColor: '#7a9b7a',
            color: '#fff',
            fontWeight: 600,
            padding: '12px 24px',
            borderRadius: 9999,
            fontSize: 16,
          }}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
