import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function SignUpDetails() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signup } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup();
    navigate('/onboarding/welcome');
  };

  return (
    <div className="flex justify-center min-h-screen bg-bg" style={{ paddingTop: 120 }}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ width: 420 }}>
        <h1 className="font-serif text-brand-dark text-center" style={{ fontSize: 36 }}>
          Solace
        </h1>

        <p className="font-serif text-text-primary text-center leading-normal" style={{ fontSize: 28 }}>
          Now, just a few more questions to create your account
        </p>

        <div className="flex" style={{ gap: 16 }}>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white border border-border rounded-lg placeholder-text-muted"
            style={{ height: 48, width: 202, fontSize: 16, padding: '0 16px' }}
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-white border border-border rounded-lg placeholder-text-muted"
            style={{ height: 48, width: 202, fontSize: 16, padding: '0 16px' }}
          />
        </div>

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white border border-border rounded-lg w-full placeholder-text-muted"
          style={{ height: 48, fontSize: 16, padding: '0 16px' }}
        />

        <div className="flex flex-col" style={{ gap: 8 }}>
          {['At least 8 characters', 'One uppercase letter', 'One number', 'One special character'].map((text) => (
            <div key={text} className="flex items-center" style={{ gap: 8 }}>
              <span className="rounded-full flex-shrink-0" style={{ width: 18, height: 18, backgroundColor: '#fff', border: '1px solid #ddd' }} />
              <span style={{ fontSize: 14, color: '#6c6c6c', fontVariationSettings: "'opsz' 14" }}>{text}</span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-brand text-white font-semibold w-full rounded-3xl hover:opacity-90 cursor-pointer"
          style={{ height: 48, fontSize: 16 }}
        >
          Create account
        </button>
      </form>
    </div>
  );
}
