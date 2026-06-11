'use client';

/**
 * Current Dashboard Mockup
 * Shows what the existing dashboard looks like based on the code
 */

import React from 'react';

export default function CurrentDashboard() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#F5F2ED',
      padding: '1.5rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#2D2D2D', marginBottom: '0.5rem' }}>
            Konquer Dashboard
          </h1>
          <p style={{ color: '#5D5D5D' }}>Current Implementation - Information Dense</p>
        </div>

        {/* Analytics Summary Card */}
        <div style={{
          background: 'white',
          border: '1px solid #E8E4DC',
          borderRadius: '1.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2D2D2D' }}>Last 7 Days</h2>
            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Live ROI telemetry</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ background: '#F5F2ED', padding: '1rem', borderRadius: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>TTFV Median</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2D2D2D' }}>12.5 min</p>
            </div>
            <div style={{ background: '#F5F2ED', padding: '1rem', borderRadius: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Net Value</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2D2D2D' }}>$45,230</p>
            </div>
            <div style={{ background: '#F5F2ED', padding: '1rem', borderRadius: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Move Conversion</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2D2D2D' }}>68.2%</p>
            </div>
            <div style={{ background: '#F5F2ED', padding: '1rem', borderRadius: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Median Agent ROI</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2D2D2D' }}>3.2×</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button style={{
            padding: '0.5rem 1rem',
            background: 'white',
            border: '1px solid #E8E4DC',
            borderRadius: '0.75rem',
            color: '#2D2D2D',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            📊 Edit Metrics
          </button>
          <button style={{
            padding: '0.5rem 1rem',
            background: '#B8824D',
            border: 'none',
            borderRadius: '0.75rem',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            ▶️ Run Pipeline
          </button>
        </div>

        {/* Sidebar + Main Content Layout */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Sidebar */}
          <div style={{
            width: '16rem',
            background: '#F5F2ED',
            borderRight: '1px solid #E8E4DC',
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Focus Card', 'Priority Stack', 'Activity Status', 'Move Decision', 'Strategy Stack', 'Business Metrics', 'Data Quality', 'All Moves'].map((item, i) => (
                <button
                  key={i}
                  style={{
                    padding: '0.75rem 1rem',
                    background: i === 0 ? '#B8824D' : 'transparent',
                    color: i === 0 ? 'white' : '#2D2D2D',
                    border: 'none',
                    borderRadius: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content - Complex Focus Card */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: '#F5F2ED',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid #E8E4DC',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E8E4DC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontStyle: 'italic' }}>𝒦</span>
                  <span style={{ fontWeight: 600, textTransform: 'uppercase', color: '#3D3D3D' }}>KONQUER</span>
                </div>
                <div style={{ padding: '0.375rem 0.75rem', background: 'white', borderRadius: '9999px', border: '2px solid rgba(184, 130, 77, 0.3)' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3D3D3D' }}>Company Name</span>
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.875rem', fontWeight: 600, color: '#4D3D2D' }}>Today's Strategic Move</h2>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#B8D4F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🎯
                  </div>
                </div>
              </div>

              {/* Main Action */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2D2D2D', marginBottom: '0.75rem' }}>
                  At 2pm, call Sarah to finalize her renewal.
                </h3>
                <p style={{ color: '#5D5D5D', lineHeight: 1.6 }}>
                  This move protects cash flow and keeps a good client relationship.
                </p>
              </div>

              {/* Stats Row */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '1.5rem', 
                marginBottom: '2rem',
                padding: '1.5rem 0',
                borderTop: '1px solid #E8E4DC',
                borderBottom: '1px solid #E8E4DC'
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2D2D2D', marginBottom: '0.25rem' }}>$18K</div>
                  <div style={{ fontSize: '0.875rem', color: '#5D5D5D' }}>Money Gained</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2D2D2D', marginBottom: '0.25rem' }}>30 days</div>
                  <div style={{ fontSize: '0.875rem', color: '#5D5D5D' }}>Time to Value</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2D2D2D', marginBottom: '0.25rem' }}>Low</div>
                  <div style={{ fontSize: '0.875rem', color: '#5D5D5D' }}>Effort</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2D2D2D', marginBottom: '0.25rem' }}>72%</div>
                  <div style={{ fontSize: '0.875rem', color: '#5D5D5D' }}>Certainty</div>
                </div>
              </div>

              {/* Collapsible Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {['Steps to Execute', '⚠️ Watchouts', 'Checklist', '📊 Key Indicators', 'Value Equation Breakdown'].map((section, i) => (
                  <div key={i} style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1rem',
                    border: '1px solid #E8E4DC'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontWeight: 600, color: '#2D2D2D' }}>{section}</h4>
                      <span style={{ color: '#5D5D5D', cursor: 'pointer' }}>▼</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button style={{
                  flex: 1,
                  minWidth: '160px',
                  padding: '0.75rem 1.5rem',
                  background: '#2D2D2D',
                  color: 'white',
                  borderRadius: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  Mark Complete
                </button>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #2D2D2D',
                  color: '#2D2D2D',
                  borderRadius: '1rem',
                  fontWeight: 600,
                  background: 'transparent',
                  cursor: 'pointer'
                }}>
                  Delay
                </button>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  color: '#2D2D2D',
                  borderRadius: '1rem',
                  fontWeight: 600,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  View Tradeoffs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
