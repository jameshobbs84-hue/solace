import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { signup } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup();
    navigate('/signup/details');
  };

  return (
    <div className="flex justify-center min-h-screen bg-bg" style={{ paddingTop: 180 }}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8" style={{ width: 420 }}>
        <h1 className="font-serif text-brand-dark text-center" style={{ fontSize: 36 }}>
          Solace
        </h1>

        <p className="font-serif text-text-primary text-center leading-normal" style={{ fontSize: 32 }}>
          To start, let's get your email address
        </p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border border-border rounded-lg w-full placeholder-text-muted"
          style={{ height: 48, fontSize: 16, padding: '0 16px' }}
        />

        <button
          type="submit"
          className="bg-brand text-white font-semibold w-full rounded-3xl hover:opacity-90 cursor-pointer"
          style={{ height: 48, fontSize: 16 }}
        >
          Get started
        </button>

        <p className="text-text-secondary text-center" style={{ fontSize: 14, color: '#6c6c6c' }}>
          Already have an account?{' '}
          <Link to="/login" className="underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
