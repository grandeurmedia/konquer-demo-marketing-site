'use client';

/**
 * Preview Page - View Current UI State
 * This page shows the current dashboard implementation
 * for comparison with Hero's Journey framework
 */

import React from 'react';
import Link from 'next/link';

export default function PreviewPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#FAF8F5',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 600, 
          color: '#2D2D2D',
          marginBottom: '1rem'
        }}>
          Konquer UI Preview
        </h1>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2D2D2D' }}>
            Current Implementation
          </h2>
          <p style={{ color: '#5D5D5D', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            The current dashboard is located at <code>/dashboard</code>. 
            It shows the existing implementation with analytics, multiple tabs, and complex focus cards.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              href="/current-dashboard"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#B8824D',
                color: 'white',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-block'
              }}
            >
              View Current Dashboard →
            </Link>
            
            <Link
              href="/hero-journey-preview"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.25)',
                color: '#2D2D2D',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-block'
              }}
            >
              Hero's Journey Preview →
            </Link>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2D2D2D' }}>
            Hero's Journey Analysis
          </h2>
          <p style={{ color: '#5D5D5D', marginBottom: '1rem', lineHeight: 1.6 }}>
            <strong>Current State:</strong> 17% of Hero's Journey implemented
          </p>
          <ul style={{ color: '#5D5D5D', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
            <li>❌ Missing: Ordinary World, Mentor, Approach, Ordeal, Road Back, Elixir</li>
            <li>⚠️ Partial: Call to Adventure, Threshold, Tests, Reward</li>
            <li>✅ Backend intelligence exists but not surfaced as journey</li>
          </ul>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '1.5rem',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2D2D2D' }}>
            Design Documents
          </h2>
          <ul style={{ color: '#5D5D5D', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
            <li><code>UI_DESIGN_SPECIFICATION.md</code> - Complete design system</li>
            <li><code>HERO_JOURNEY_UI_ANALYSIS.md</code> - Hero's Journey gap analysis</li>
            <li><code>UI_UX_GAP_ANALYSIS.md</code> - Current vs. vision comparison</li>
            <li><code>UI_DESIGN_IMPLEMENTATION_GUIDE.md</code> - Implementation steps</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
