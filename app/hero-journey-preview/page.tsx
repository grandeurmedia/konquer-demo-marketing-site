'use client';

/**
 * Hero's Journey Preview
 * Shows how the UI should feel with Hero's Journey framework
 */

import React, { useState } from 'react';

const heroJourneyStages = [
  { id: 1, name: 'Ordinary World', description: 'Current state: overwhelmed, scattered' },
  { id: 2, name: 'Call to Adventure', description: 'Here\'s the one move that matters' },
  { id: 3, name: 'Refusal of Call', description: 'Why this? (addressing hesitation)' },
  { id: 4, name: 'Meeting Mentor', description: 'Orb and Kong appear as guides' },
  { id: 5, name: 'Crossing Threshold', description: 'Let\'s do it - the commitment' },
  { id: 6, name: 'Tests & Allies', description: 'Support during challenges' },
  { id: 7, name: 'Approach to Cave', description: 'Preparation: context, cheat sheet' },
  { id: 8, name: 'Ordeal', description: 'This is the moment - execution' },
  { id: 9, name: 'Reward', description: 'How did it go? Celebration' },
  { id: 10, name: 'Road Back', description: 'What did you learn?' },
  { id: 11, name: 'Resurrection', description: 'You\'re getting better' },
  { id: 12, name: 'Return with Elixir', description: 'Because you focused... (compounding)' },
];

export default function HeroJourneyPreview() {
  const [currentStage, setCurrentStage] = useState(2); // Start at Call to Adventure

  const currentStageData = heroJourneyStages.find(s => s.id === currentStage);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#FAF8F5',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Journey Progress */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '1.5rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '0.875rem', color: '#5D5D5D', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your Journey
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {heroJourneyStages.map(stage => (
              <button
                key={stage.id}
                onClick={() => setCurrentStage(stage.id)}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentStage === stage.id 
                    ? 'rgba(184, 130, 77, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${currentStage === stage.id ? '#B8824D' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  color: currentStage === stage.id ? '#2D2D2D' : '#5D5D5D',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {stage.id}
              </button>
            ))}
          </div>
        </div>

        {/* Main Move Card - Hero's Journey Style */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '2rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 600, 
            color: '#2D2D2D',
            marginBottom: '2rem',
            letterSpacing: '-0.02em'
          }}>
            Today's Konquer Move™
          </h1>

          <p style={{ 
            fontSize: '2rem', 
            fontWeight: 500, 
            color: '#2D2D2D',
            marginBottom: '3rem',
            lineHeight: 1.4
          }}>
            At 2pm, call Sarah to finalize her renewal.
          </p>

          {/* Four Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            marginBottom: '3rem',
            padding: '2rem 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2D2D2D', marginBottom: '0.5rem' }}>$18k</div>
              <div style={{ fontSize: '0.75rem', color: '#5D5D5D', textTransform: 'uppercase' }}>Money</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏱️</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2D2D2D', marginBottom: '0.5rem' }}>30 min</div>
              <div style={{ fontSize: '0.75rem', color: '#5D5D5D', textTransform: 'uppercase' }}>Time</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2D2D2D', marginBottom: '0.5rem' }}>Low</div>
              <div style={{ fontSize: '0.75rem', color: '#5D5D5D', textTransform: 'uppercase' }}>Energy</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2D2D2D', marginBottom: '0.5rem' }}>72%</div>
              <div style={{ fontSize: '0.75rem', color: '#5D5D5D', textTransform: 'uppercase' }}>Certainty</div>
            </div>
          </div>

          {/* Journey Stage Context */}
          <div style={{
            background: 'rgba(184, 130, 77, 0.1)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '0.875rem', color: '#5D5D5D', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Stage {currentStage}: {currentStageData?.name}
            </h3>
            <p style={{ fontSize: '1rem', color: '#2D2D2D', lineHeight: 1.6 }}>
              {currentStageData?.description}
            </p>
          </div>

          {/* Action Button */}
          <button style={{
            width: '100%',
            padding: '1.25rem 2rem',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#2D2D2D',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
          }}
          >
            Let's do it
          </button>
        </div>

        {/* Mentor Orb & Kong */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Mentor Orb */}
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(184, 130, 77, 0.2))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(184, 130, 77, 0.3)',
            cursor: 'pointer',
            animation: 'gentle-pulse 3s ease-in-out infinite'
          }} />

          {/* Kong Companion */}
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            left: '2rem',
            maxWidth: '280px',
            padding: '1rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '1.25rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
          }}>
            <p style={{ fontSize: '0.875rem', color: 'rgba(45, 45, 45, 0.9)', margin: 0, lineHeight: 1.5 }}>
              🦍 Lock this in, and we'll notch a clean win for the day.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gentle-pulse {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(184, 130, 77, 0.3);
          }
          50% {
            box-shadow: 0 12px 40px rgba(184, 130, 77, 0.4);
          }
        }
      `}</style>
    </div>
  );
}
