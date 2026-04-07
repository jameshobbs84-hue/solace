import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/');
  };

  return (
    <div className="flex justify-center min-h-screen bg-bg" style={{ paddingTop: 160 }}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ width: 420 }}>
        <h1 className="font-serif text-brand-dark text-center" style={{ fontSize: 36 }}>
          Solace
        </h1>

        <div className="text-center">
          <p className="font-serif text-text-primary" style={{ fontSize: 36 }}>
            Welcome back
          </p>
          <p className="text-text-muted" style={{ fontSize: 16 }}>
            Log in to continue your journey
          </p>
        </div>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border border-border rounded-lg w-full placeholder-text-muted"
          style={{ height: 48, fontSize: 16, padding: '0 16px' }}
        />

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border border-border rounded-lg px-4 w-full placeholder-text-muted"
            style={{ height: 48, fontSize: 16 }}
          />
          <div className="flex justify-end mt-2">
            <span className="text-brand font-medium cursor-pointer hover:underline" style={{ fontSize: 14 }}>
              Forgot password?
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-brand text-white font-semibold w-full rounded-3xl hover:opacity-90 cursor-pointer"
          style={{ height: 48, fontSize: 16 }}
        >
          Log in
        </button>

        <p className="text-center" style={{ fontSize: 14, color: '#6c6c6c' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
