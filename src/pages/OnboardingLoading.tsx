import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function OnboardingLoading() {
  const navigate = useNavigate();
  const { signup } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      signup();
      navigate('/');
    }, 2500);
    return () => clearTimeout(timer);
  }, [signup, navigate]);

  return (
    <div className="bg-bg flex justify-center min-h-screen">
      <div className="flex flex-col items-center" style={{ width: 400, paddingTop: 320, gap: 20 }}>
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="border-4 border-brand-light border-t-brand rounded-full animate-spin" style={{ width: 48, height: 48 }} />
        </div>

        {/* Heading */}
        <p className="font-serif text-center" style={{ fontSize: 24, color: '#222', lineHeight: 'normal' }}>
          We're organizing your{'\n'}dashboard to meet your needs...
        </p>

        {/* Subtitle */}
        <p className="text-center" style={{ fontSize: 16, color: '#8c8c8c', fontVariationSettings: "'opsz' 14" }}>
          This will only take a moment
        </p>
      </div>
    </div>
  );
}
