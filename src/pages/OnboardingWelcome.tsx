import { useNavigate } from 'react-router-dom';

const steps = [1, 2, 3, 4, 5];

export default function OnboardingWelcome() {
  const navigate = useNavigate();

  return (
    <div className="bg-bg flex justify-center min-h-screen">
      <div className="flex flex-col items-center gap-6" style={{ width: 480, paddingTop: 200 }}>
        <h1 className="font-serif text-center w-full" style={{ fontSize: 40, color: '#222' }}>
          Personalize your experience
        </h1>

        <p className="font-sans text-center" style={{ fontSize: 16, color: '#6c6c6c', lineHeight: '24px' }}>
          We'll use your answers to tailor content recommendations just for you.
        </p>

        <button
          onClick={() => navigate('/onboarding/stage')}
          className="bg-brand text-white font-semibold text-base rounded-3xl cursor-pointer"
          style={{ width: 320, height: 48 }}
        >
          Let's go
        </button>

        <div className="flex items-center justify-center gap-2 mt-4">
          {steps.map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full ${
                step === 1 ? 'bg-brand' : 'bg-border-medium'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
