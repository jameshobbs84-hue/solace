import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const options = ['Sleep', 'Anxiety', 'Movement', 'Relationships', 'Nutrition', 'Mindfulness'];
const steps = [1, 2, 3, 4, 5];

export default function OnboardingFocus() {
  const navigate = useNavigate();
  const { setOnboardingData } = useUser();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    setOnboardingData({ focusAreas: selected });
    navigate('/onboarding/preference');
  };

  return (
    <div className="bg-bg flex justify-center min-h-screen">
      <div className="flex flex-col items-center gap-6" style={{ width: 520, paddingTop: 100 }}>
        <h1 className="font-serif text-center" style={{ fontSize: 32, color: '#222' }}>
          What would you like to focus on?
        </h1>

        <p className="font-sans text-center" style={{ fontSize: 16, color: '#6c6c6c', lineHeight: '24px' }}>
          Pick as many as you like.
        </p>

        <div className="grid grid-cols-2" style={{ width: 420, gap: 12 }}>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => toggle(option)}
              className="cursor-pointer transition rounded-xl"
              style={{
                width: 200,
                height: 56,
                fontSize: 16,
                fontWeight: 500,
                ...(selected.includes(option)
                  ? { background: '#e8f0e8', border: '2px solid #7a9b7a', color: '#3d5a3d' }
                  : { background: 'white', border: '1px solid #ebebeb', color: '#222' }),
              }}
            >
              {option}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 14, color: '#8c8c8c' }}>Skip for now</p>

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
                step <= 3 ? 'bg-brand' : 'bg-border-medium'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
