import React, { useState } from 'react';

// Placeholder daily backgrounds and scenarios
type DayScenario = {
  day: number;
  background: string;
  goal: string;
  scenario: string;
  options: { role: string; text: string; }[];
};

const dailyScenarios: DayScenario[] = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  background: `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80`, // Replace with different images per day if desired
  goal: `Goal for Day ${i + 1}`,
  scenario: `Scenario description for Day ${i + 1}. Each team member can apply their specialty role and make a decision.`,
  options: [
    { role: 'Engineer', text: 'Optimize the workflow.' },
    { role: 'Designer', text: 'Improve the UI.' },
    { role: 'Manager', text: 'Coordinate the team.' },
    { role: 'Sales', text: 'Pitch to a new client.' },
  ],
}));

const Board2D: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [showScenario, setShowScenario] = useState(true);
  const scenario = dailyScenarios[currentDay - 1];

  // Handle option selection (placeholder)
  const handleOptionSelect = (optionIdx: number) => {
    setShowScenario(false);
    // TODO: Save decision, update metrics, etc.
  };

  // Go to next day
  const handleNextDay = () => {
    if (currentDay < 30) {
      setCurrentDay(currentDay + 1);
      setShowScenario(true);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Background image */}
      <img
        src={scenario.background}
        alt={`Day ${currentDay} background`}
        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />
      {/* Overlay for dimming */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(20,30,40,0.5)', zIndex: 1 }} />
      {/* 2D Progress Bar */}
      <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 2, width: '80%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {dailyScenarios.map((d, idx) => (
            <div key={d.day} style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: idx + 1 === currentDay ? '#4F8EF7' : '#b0bec5',
                  border: idx + 1 === currentDay ? '3px solid #FFD700' : '2px solid #78909c',
                  margin: '0 auto',
                  transition: 'background 0.3s, border 0.3s',
                }}
              />
              <div style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>{d.day}</div>
            </div>
          ))}
        </div>
        {/* Progress bar line */}
        <div style={{ height: 4, background: '#78909c', margin: '8px 0', borderRadius: 2, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: 4,
              width: `${((currentDay - 1) / 29) * 100}%`,
              background: 'linear-gradient(90deg, #4F8EF7, #FFD700)',
              borderRadius: 2,
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>
      {/* HUD */}
      <div style={{ position: 'absolute', top: 20, right: 40, zIndex: 3, color: '#fff', background: 'rgba(30,40,60,0.7)', padding: '16px 32px', borderRadius: 12, fontSize: 18 }}>
        <div>💰 Company Dollars: <b>$50,000</b></div>
        <div>🏆 Promotions: <b>2</b></div>
        <div>📦 Assets: <b>5</b></div>
        <div>📅 Day: <b>{currentDay}/30</b></div>
      </div>
      {/* Scenario Modal */}
      {showScenario && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, background: 'rgba(20,30,40,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 500, width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
            <h2 style={{ color: '#4F8EF7', marginBottom: 12 }}>Day {currentDay} Goal</h2>
            <div style={{ color: '#222', fontWeight: 500, marginBottom: 16 }}>{scenario.goal}</div>
            <div style={{ color: '#444', marginBottom: 24 }}>{scenario.scenario}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {scenario.options.map((opt, idx) => (
                <button
                  key={opt.role}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#f5f5f5',
                    color: '#333',
                    fontWeight: 500,
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => handleOptionSelect(idx)}
                >
                  {opt.role}: {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Next Day Button */}
      {!showScenario && (
        <button
          style={{ position: 'absolute', bottom: 40, right: 60, zIndex: 10, background: 'linear-gradient(90deg,#4F8EF7,#FFD700)', color: '#fff', fontWeight: 700, fontSize: 20, border: 'none', borderRadius: 10, padding: '16px 40px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', cursor: 'pointer' }}
          onClick={handleNextDay}
        >
          Next Day
        </button>
      )}
    </div>
  );
};

export default Board2D; 