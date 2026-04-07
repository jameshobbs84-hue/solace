import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const options = ['Just starting out', 'Finding my footing', 'Ready to go deeper'];
const steps = [1, 2, 3, 4, 5];

export default function OnboardingStage() {
  const navigate = useNavigate();
  const { setOnboardingData } = useUser();
  const [selected, setSelected] = useState('');

  const handleNext = () => {
    setOnboardingData({ stage: selected });
    navigate('/onboarding/focus');
  };

  return (
    <div className="bg-bg flex justify-center min-h-screen">
      <div className="flex flex-col items-center gap-6" style={{ width: 480, paddingTop: 140 }}>
        <h1 className="font-serif text-center" style={{ fontSize: 32, color: '#222' }}>
          Where are you on your wellness journey?
        </h1>

        <p className="font-sans text-center" style={{ fontSize: 16, color: '#6c6c6c', lineHeight: '24px' }}>
          This helps us recommend the right content for you.
        </p>

        <div className="flex flex-col items-center" style={{ width: 380, gap: 12 }}>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className="cursor-pointer transition rounded-xl w-full"
              style={{
                height: 56,
                fontSize: 16,
                fontWeight: 500,
                ...(selected === option
                  ? { background: '#e8f0e8', border: '2px solid #7a9b7a', color: '#3d5a3d' }
                  : { background: 'white', border: '1px solid #ebebeb', color: '#222' }),
              }}
            >
              {option}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 14, color: '#8c8c8c' }}>Not sure? Just tap Next</p>

        <button
          onClick={handleNext}
          className="bg-brand text-white font-semibold text-base rounded-3xl cursor-pointer"
          style={{ width: 320, height: 48 }}
        >
          Next
        </button>

        <div className="flex items-center justify-center gap-2 mt-4">
          {steps.map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full ${
                step <= 2 ? 'bg-brand' : 'bg-border-medium'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
