'use client';

/**
 * Decision Clarity UI Preview - Direction A
 * Minimalist, typography-driven design
 * THE move as large centered statement, value metrics as inline badges
 * Strategy stack as vertical sequence, focus on one decision at a time
 * Now with light/dark mode support and new color palette
 */

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';

function DecisionClarityPreviewContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Color palette - Elegant, minimalistic with proper color psychology
  const colors = {
    light: {
      bg: 'bg-[#FAF8F5]',
      bgCard: 'bg-white',
      bgSecondary: 'bg-[#F5F5F5]',
      text: 'text-[#2D2D2D]',
      textSecondary: 'text-[#6B6B6B]',
      textMuted: 'text-[#9A9A9A]',
      border: 'border-[#E5E5E5]',
      borderSecondary: 'border-[#D5D5D5]',
      // Primary accent - Sage green (trust, growth, clarity)
      accent: 'text-[#7A9B6B]', // Muted sage green
      accentBg: 'bg-[#7A9B6B]',
      accentBorder: 'border-[#7A9B6B]',
      // Success/Positive - Soft teal (calm confidence)
      success: 'text-[#6BA89B]', // Muted teal
      successBg: 'bg-[#6BA89B]',
      successBorder: 'border-[#6BA89B]',
      // Alerts/Warnings - Muted terracotta (gentle attention, not alarming)
      alert: 'text-[#C97D60]', // Muted terracotta
      alertBg: 'bg-[#C97D60]',
      alertBorder: 'border-[#C97D60]',
      // Errors/Negative - Muted rose (clear but not harsh)
      error: 'text-[#B87D7D]', // Muted rose
      errorBg: 'bg-[#B87D7D]',
      errorBorder: 'border-[#B87D7D]',
    },
    dark: {
      bg: 'bg-[#1F1F1F]',
      bgCard: 'bg-[#2A2A2A]',
      bgSecondary: 'bg-[#252525]',
      text: 'text-[#F5F5F5]',
      textSecondary: 'text-[#B5B5B5]',
      textMuted: 'text-[#8A8A8A]',
      border: 'border-[#3A3A3A]',
      borderSecondary: 'border-[#4A4A4A]',
      // Primary accent - Lighter sage green (maintains trust, adds sophistication)
      accent: 'text-[#9AB88A]', // Lighter muted sage
      accentBg: 'bg-[#9AB88A]',
      accentBorder: 'border-[#9AB88A]',
      // Success/Positive - Lighter muted teal (confident but not boastful)
      success: 'text-[#7DB8A8]', // Lighter muted teal
      successBg: 'bg-[#7DB8A8]',
      successBorder: 'border-[#7DB8A8]',
      // Alerts/Warnings - Softer terracotta (visible but not jarring)
      alert: 'text-[#E89F7D]', // Softer terracotta
      alertBg: 'bg-[#E89F7D]',
      alertBorder: 'border-[#E89F7D]',
      // Errors/Negative - Softer rose (clear but not aggressive)
      error: 'text-[#D99A9A]', // Softer rose
      errorBg: 'bg-[#D99A9A]',
      errorBorder: 'border-[#D99A9A]',
    },
  };

  const c = isDark ? colors.dark : colors.light;

  return (
    <div className={`min-h-screen ${c.bg} ${c.text} transition-colors duration-200`}>
      {/* Minimal Header */}
      <header className={`sticky top-0 z-50 ${c.bg}/80 backdrop-blur-xl border-b ${c.border}`}>
        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-serif italic ${c.accent}`}>𝒦</span>
            <span className={`text-[13px] font-semibold uppercase tracking-[0.1em] ${c.textSecondary}`}>KONQUER</span>
          </div>
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <Link 
              href="/decision-clarity-preview-alt"
              className={`text-sm font-medium ${c.textSecondary} hover:${c.text} transition-colors`}
            >
              View Alternative →
            </Link>
            <Link 
              href="/strategic-command-preview"
              className={`text-sm font-medium ${c.textSecondary} hover:${c.text} transition-colors`}
            >
              View Strategy Execution →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-24">
        {/* Chunk 1: What is the move? */}
        <div className="text-center mb-20">
          <div className="inline-block mb-10">
            <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${c.textMuted}`}>
              Highest Leverage Move
            </span>
          </div>
          
          <h1 className={`text-6xl md:text-7xl font-semibold leading-[1.05] mb-8 ${c.text} max-w-3xl mx-auto tracking-[-0.02em]`}>
            Cut your sales cycle from 68 days to 45 days
          </h1>

          <p className={`text-sm font-medium ${c.success} mb-6 tracking-wide`}>
            Saves Time (Functional) • Unlocks 40% of sales capacity
          </p>
        </div>

        {/* Chunk 2: Why does it matter? */}
        <div className="mb-20">
          <p className={`text-xl font-normal ${c.textSecondary} leading-[1.5] max-w-2xl mx-auto text-center`}>
            Your sales cycle lengthened 52% this quarter. This move fixes the root cause: 
            unqualified leads consuming 40% of sales time.
          </p>
        </div>

        {/* Chunk 3: Key metrics - Confidence, Time, Effort */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-16">
            <div className="text-center">
              <div className={`text-5xl font-semibold ${c.accent} mb-3 tracking-[-0.02em]`}>80%</div>
              <div className={`text-sm font-medium ${c.textMuted} tracking-wide`}>Confidence</div>
            </div>
            <div className={`w-[1px] h-16 ${c.border}`}></div>
            <div className="text-center">
              <div className={`text-5xl font-semibold ${c.text} mb-3 tracking-[-0.02em]`}>21 days</div>
              <div className={`text-sm font-medium ${c.textMuted} tracking-wide`}>Time to know</div>
            </div>
            <div className={`w-[1px] h-16 ${c.border}`}></div>
            <div className="text-center">
              <div className={`text-5xl font-semibold ${c.text} mb-3 tracking-[-0.02em]`}>Medium</div>
              <div className={`text-sm font-medium ${c.textMuted} tracking-wide`}>Effort</div>
            </div>
          </div>
        </div>

        {/* Chunk 4: Impact vs Cost */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-6">
            <div className={`${c.bgCard} rounded-2xl px-10 py-6 border ${c.border} ${isDark ? 'shadow-[0_4px_16px_rgba(0,0,0,0.3)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
              <div className={`text-[11px] font-semibold ${c.textMuted} mb-3 uppercase tracking-wide`}>Impact</div>
              <div className={`text-2xl font-semibold ${c.success} tracking-[-0.01em]`}>$250K ARR</div>
              <div className={`text-sm font-normal ${c.textMuted} mt-1`}>in 3 months</div>
            </div>
            <div className={`${c.bgCard} rounded-2xl px-10 py-6 border ${c.border} ${isDark ? 'shadow-[0_4px_16px_rgba(0,0,0,0.3)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
              <div className={`text-[11px] font-semibold ${c.textMuted} mb-3 uppercase tracking-wide`}>Cost of waiting</div>
              <div className={`text-2xl font-semibold ${c.alert} tracking-[-0.01em]`}>$50K</div>
              <div className={`text-sm font-normal ${c.textMuted} mt-1`}>per week</div>
            </div>
          </div>
        </div>

        {/* Chunk 5: Value Score - Final confirmation */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-5 px-12 py-6 ${c.bgCard} rounded-full border ${c.border} ${isDark ? 'shadow-[0_4px_16px_rgba(0,0,0,0.3)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
            <span className={`text-sm font-semibold ${c.textMuted} uppercase tracking-wide`}>Value Score</span>
            <span className={`text-5xl font-semibold ${c.accent} tracking-[-0.02em]`}>82.5</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DecisionClarityPreview() {
  return (
    <ThemeProvider>
      <DecisionClarityPreviewContent />
    </ThemeProvider>
  );
}
