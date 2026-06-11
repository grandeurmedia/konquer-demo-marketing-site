'use client';

/**
 * Decision Clarity UI Preview - Alternative Version
 * Matches original Option 1 HTML demo design exactly
 */

import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';

function DecisionClarityPreviewAltContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Original Option 1 color palette from HTML demo
  const colors = {
    bgMain: '#E8E4DC',
    bgCard: '#F5F2ED',
    bgSidebar: '#D5D1C9',
    textDark: '#3D3D3D',
    textMedium: '#5D5D5D',
    textLight: '#7D7D7D',
    accent: '#B8824D',
    darkBg: '#2D2D2D',
    borderLight: '#E8E4DC',
  };

  const [currentStep, setCurrentStep] = useState(0);
  const executionSteps = [
    {
      number: 1,
      title: "Review Lead Profiles",
      description: "Pull up contact details and previous conversation history for all 3 leads",
    },
    {
      number: 2,
      title: "Craft Personalized Messages",
      description: "Reference their specific pain points and your solution's unique value proposition",
    },
    {
      number: 3,
      title: "Schedule Follow-up Calls",
      description: "Book 30-min discovery calls within the next 48 hours while momentum is high",
    },
    {
      number: 4,
      title: "Prepare Pitch Materials",
      description: "Customize deck with case studies relevant to each lead's industry vertical",
    },
    {
      number: 5,
      title: "Set Success Metrics",
      description: "Define clear next steps and track conversion probability in your pipeline",
    },
  ];

  const nextCard = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevCard = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      background: colors.bgMain,
      minHeight: '100vh',
      color: colors.textDark
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: `${colors.bgMain}80`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.borderLight}`,
        padding: '16px 32px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>𝒦</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.textDark }}>KONQUER</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ThemeToggle />
            <Link 
              href="/decision-clarity-preview"
              style={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                color: colors.textMedium,
                textDecoration: 'none'
              }}
            >
              View Original →
            </Link>
            <Link 
              href="/strategic-command-preview"
              style={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                color: colors.textMedium,
                textDecoration: 'none'
              }}
            >
              View Strategy Execution →
            </Link>
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px'
      }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <div style={{ flex: 1 }}></div>
          <div style={{
            flex: 1,
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 400
          }}>
            Good <span id="timeOfDay">Afternoon</span>, <span style={{ color: colors.accent, fontWeight: 500 }}>Founder</span>
          </div>
          <div style={{
            flex: 1,
            textAlign: 'right'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: colors.darkBg,
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>
              F
            </div>
          </div>
        </div>

        {/* Cards Container */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Main Strategic Move Card */}
          <div style={{
            flex: 1,
            background: colors.bgCard,
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            {/* Card Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: colors.textDark
              }}>
                <span style={{ fontSize: '20px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>𝒦</span>
                <span>KONQUER</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'white',
                border: `2px solid rgba(184, 130, 77, 0.3)`,
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: 500,
                color: colors.textDark
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  K
                </div>
                <span>SAVAGE CEO</span>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: colors.accent,
                  animation: 'pulse 2s infinite'
                }}></div>
              </div>
            </div>

            {/* Move Title Section */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: 0
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 500,
                  color: '#4D3D2D',
                  margin: 0
                }}>
                  Today's Strategic Move
                </h3>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#B8D4F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4D7BA8',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  🎯
                </div>
              </div>
            </div>

            {/* Move Description */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '18px',
                color: colors.textDark,
                marginBottom: '8px',
                fontWeight: 500,
                lineHeight: 1.4
              }}>
                Cut your sales cycle from 68 days to 45 days
              </p>
              <p style={{
                fontSize: '14px',
                color: colors.textLight,
                lineHeight: 1.4,
                margin: 0
              }}>
                Your sales cycle lengthened 52% this quarter. This move fixes the root cause: unqualified leads consuming 40% of sales time.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px'
            }}>
              <button style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                background: colors.darkBg,
                color: 'white',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#4D4D4D'}
              onMouseLeave={(e) => e.currentTarget.style.background = colors.darkBg}
              >
                Execute
              </button>
              <button style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'transparent',
                color: colors.darkBg,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(45, 45, 45, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                View Tradeoffs
              </button>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: colors.darkBg,
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}>
                    $250K
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: colors.textLight,
                    lineHeight: 1.2
                  }}>
                    Money Gained
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: colors.accent,
                  flexShrink: 0,
                  marginTop: '6px'
                }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: colors.darkBg,
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}>
                    21 days
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: colors.textLight,
                    lineHeight: 1.2
                  }}>
                    Time to Value
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: colors.accent,
                  flexShrink: 0,
                  marginTop: '6px'
                }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: colors.darkBg,
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}>
                    Medium
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: colors.textLight,
                    lineHeight: 1.2
                  }}>
                    Effort
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: colors.darkBg,
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}>
                    80%
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: colors.textLight,
                    lineHeight: 1.2
                  }}>
                    Certainty
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Deck */}
          <div style={{
            width: '320px',
            flexShrink: 0,
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(200, 150, 200, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }}></div>

            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ marginBottom: '4px' }}>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: colors.textDark,
                    margin: 0
                  }}>
                    Execution Deck
                  </h4>
                </div>
                <div style={{
                  fontSize: '13px',
                  color: colors.textLight
                }}>
                  Step {currentStep + 1} of {executionSteps.length}
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexShrink: 0
              }}>
                <button
                  onClick={prevCard}
                  disabled={currentStep === 0}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: colors.bgCard,
                    border: 'none',
                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.textDark,
                    fontSize: '16px',
                    opacity: currentStep === 0 ? 0.3 : 1
                  }}
                >
                  ←
                </button>
                <button
                  onClick={nextCard}
                  disabled={currentStep === executionSteps.length - 1}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: colors.bgCard,
                    border: 'none',
                    cursor: currentStep === executionSteps.length - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.textDark,
                    fontSize: '16px',
                    opacity: currentStep === executionSteps.length - 1 ? 0.3 : 1
                  }}
                >
                  →
                </button>
              </div>
            </div>

            <div style={{
              position: 'relative',
              height: '260px',
              marginBottom: '16px',
              flexShrink: 0
            }}>
              {executionSteps.map((step, index) => {
                const offset = Math.abs(index - currentStep);
                const isVisible = offset <= 2;
                if (!isVisible) return null;

                return (
                  <div
                    key={step.number}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, #F8F3EB 0%, #F0EBE3 100%)',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                      border: `1px solid ${colors.borderLight}`,
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                      transform: offset === 0 
                        ? 'translateX(0) translateY(0) scale(1)'
                        : offset === 1
                        ? 'translateX(12px) translateY(8px) scale(0.95)'
                        : 'translateX(24px) translateY(16px) scale(0.9)',
                      zIndex: 30 - (offset * 10),
                      opacity: offset === 0 ? 1 : offset === 1 ? 0.3 : 0.15,
                      pointerEvents: offset === 0 ? 'auto' : 'none'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: colors.darkBg,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 600
                      }}>
                        {step.number}
                      </div>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '2px solid #CCCCCC',
                        background: '#E8E8E8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999999',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h5 style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#2D2D2D',
                        marginBottom: '8px',
                        lineHeight: 1.3
                      }}>
                        {step.title}
                      </h5>
                      <p style={{
                        fontSize: '13px',
                        color: '#5D5D5D',
                        marginBottom: '12px',
                        flex: 1,
                        lineHeight: 1.5
                      }}>
                        {step.description}
                      </p>
                      {index === currentStep && (
                        <div style={{
                          width: '100%',
                          height: '80px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #B3D9FF 0%, #E0E0E0 100%)'
                        }}></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '4px',
              position: 'relative',
              zIndex: 1
            }}>
              {executionSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  style={{
                    height: '4px',
                    borderRadius: '2px',
                    background: index === currentStep ? colors.darkBg : '#D5D1C9',
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0,
                    width: index === currentStep ? '32px' : '4px',
                    transition: 'all 0.3s ease'
                  }}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: colors.textDark
              }}>
                CAC
              </span>
              <span style={{
                fontSize: '11px',
                color: colors.textLight
              }}>
                30-Days
              </span>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 600,
              color: colors.darkBg
            }}>
              $150
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: colors.textDark
              }}>
                LTV
              </span>
              <span style={{
                fontSize: '11px',
                color: colors.textLight
              }}>
                6 months
              </span>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 600,
              color: colors.darkBg
            }}>
              $1,350
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: colors.textDark
              }}>
                PIPELINE
              </span>
              <span style={{
                fontSize: '11px',
                color: colors.textLight
              }}>
                30-Days
              </span>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 600,
              color: colors.darkBg
            }}>
              $7,350
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: colors.textDark
              }}>
                $ Margin
              </span>
              <span style={{
                fontSize: '11px',
                color: colors.textLight
              }}>
                6 months
              </span>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 600,
              color: colors.darkBg
            }}>
              68%
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default function DecisionClarityPreviewAlt() {
  return (
    <ThemeProvider>
      <DecisionClarityPreviewAltContent />
    </ThemeProvider>
  );
}
