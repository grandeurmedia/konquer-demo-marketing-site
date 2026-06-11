'use client';

/**
 * Strategic Command UI Preview - Direction A
 * Dashboard-style layout with clear hierarchy
 * Dark charcoal base with warm amber accents
 * THE move in prominent hero card, value compass metrics, strategy stack timeline
 */

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';

function StrategicCommandPreviewContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Original Direction A: Dark charcoal base with warm amber accents
  const colors = {
    light: {
      bg: 'bg-[#FAF8F5]',
      bgCard: 'bg-white',
      bgSecondary: 'bg-[#F5F5F5]',
      text: 'text-[#2D2D2D]',
      textSecondary: 'text-[#6B6B6B]',
      textMuted: 'text-[#9A9A9A]',
      border: 'border-[#E5E5E5]',
      accent: 'text-[#D97706]', // Warm amber
      accentBg: 'bg-[#D97706]',
      accentBorder: 'border-[#D97706]',
      success: 'text-[#059669]',
      alert: 'text-[#DC2626]',
    },
    dark: {
      bg: 'bg-[#1A1A1A]', // Dark charcoal
      bgCard: 'bg-[#2A2A2A]',
      bgSecondary: 'bg-[#252525]',
      text: 'text-[#F5F5F5]',
      textSecondary: 'text-[#B5B5B5]',
      textMuted: 'text-[#8A8A8A]',
      border: 'border-[#3A3A3A]',
      accent: 'text-[#F59E0B]', // Warm amber
      accentBg: 'bg-[#F59E0B]',
      accentBorder: 'border-[#F59E0B]',
      success: 'text-[#10B981]',
      alert: 'text-[#EF4444]',
    },
  };

  const c = isDark ? colors.dark : colors.light;

  return (
    <div className={`min-h-screen ${c.bg} ${c.text} transition-colors duration-200`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${c.bg}/80 backdrop-blur-xl border-b ${c.border}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-serif italic ${c.accent}`}>𝒦</span>
            <span className={`text-[13px] font-semibold uppercase tracking-[0.1em] ${c.textSecondary}`}>KONQUER</span>
          </div>
          <div className="flex items-center gap-5">
            <span className={`text-sm font-medium ${c.textMuted}`}>View Strategy</span>
            <ThemeToggle />
            <Link 
              href="/decision-clarity-preview"
              className={`px-5 py-2.5 ${c.bgCard} border ${c.border} rounded-xl text-sm font-semibold transition-colors ${isDark ? 'hover:bg-[#2C2C2E]' : 'hover:bg-[#F5F5F7]'}`}
            >
              Highest Leverage Move →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Hero Move Card - THE Move */}
        <div className="mb-8">
          <div className={`${c.bgCard} rounded-2xl p-8 border ${c.border} shadow-lg`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 ${c.accentBg} rounded-full animate-pulse`}></div>
                  <span className={`text-sm font-medium ${c.accent} uppercase tracking-wide`}>Today's Strategic Move</span>
                </div>
                <h1 className={`text-4xl font-bold mb-4 leading-tight ${c.text}`}>
                  Implement sales qualification framework to reduce sales cycle
                </h1>
                <p className={`${c.textSecondary} text-lg max-w-3xl leading-relaxed mb-4`}>
                  Your sales cycle has lengthened 52% in the past quarter. This move addresses the root cause: 
                  unqualified leads consuming 40% of sales time. Implementing a structured qualification process 
                  will reduce cycle time by 30% and increase close rate by 15%.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={c.textMuted}>Cost of delay:</span>
                    <span className={`font-semibold ${c.alert}`}>$50K/week</span>
                  </div>
                  <div className={`w-px h-4 ${c.border}`}></div>
                  <div className="flex items-center gap-2">
                    <span className={c.textMuted}>Expected impact:</span>
                    <span className={`font-semibold ${c.success}`}>$250K ARR in 3 months</span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-6">
                <div className={`text-5xl font-bold ${c.accent} mb-1`}>82.5</div>
                <div className={`text-sm ${c.textMuted} uppercase tracking-wide`}>Value Score</div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className={`grid grid-cols-4 gap-4 mt-8 pt-8 border-t ${c.border}`}>
              <div>
                <div className={`text-xs ${c.textMuted} uppercase tracking-wide mb-2`}>Money Lift</div>
                <div className={`text-2xl font-bold ${c.text}`}>$250K</div>
              </div>
              <div>
                <div className={`text-xs ${c.textMuted} uppercase tracking-wide mb-2`}>Time to Value</div>
                <div className={`text-2xl font-bold ${c.text}`}>21 days</div>
              </div>
              <div>
                <div className={`text-xs ${c.textMuted} uppercase tracking-wide mb-2`}>Certainty</div>
                <div className={`text-2xl font-bold ${c.text}`}>80%</div>
              </div>
              <div>
                <div className={`text-xs ${c.textMuted} uppercase tracking-wide mb-2`}>Effort</div>
                <div className={`text-2xl font-bold ${c.text}`}>Medium</div>
              </div>
            </div>
          </div>
        </div>

        {/* Why This Matters - Decision Context */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${c.textSecondary}`}>Why This Move Matters</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* The Problem */}
            <div className={`${c.bgCard} rounded-xl p-6 border ${c.border}`}>
              <div className="mb-3">
                <span className={`text-sm font-medium ${c.alert} uppercase tracking-wide`}>The Problem</span>
              </div>
              <p className={`${c.textSecondary} leading-relaxed mb-3`}>
                Your sales cycle has lengthened from 45 to 68 days over the past quarter. 
                This is costing you <span className={`font-semibold ${c.text}`}>$50K per week</span> in delayed revenue.
              </p>
              <div className={`text-xs ${c.textMuted}`}>
                <span className="font-medium">Root cause:</span> Sales team is spending 40% of time on unqualified leads
              </div>
            </div>

            {/* The Opportunity */}
            <div className={`${c.bgCard} rounded-xl p-6 border ${c.border}`}>
              <div className="mb-3">
                <span className={`text-sm font-medium ${c.success} uppercase tracking-wide`}>The Opportunity</span>
              </div>
              <p className={`${c.textSecondary} leading-relaxed mb-3`}>
                Implementing qualification framework will reduce cycle time by 30% and 
                increase close rate by 15%, delivering <span className={`font-semibold ${c.text}`}>$250K in additional ARR</span> within 3 months.
              </p>
              <div className={`text-xs ${c.textMuted}`}>
                <span className="font-medium">Evidence:</span> Similar companies saw 28-35% improvement
              </div>
            </div>
          </div>

          {/* Value Compass with Context */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { 
                label: 'Money', 
                value: '$250K', 
                score: 85, 
                story: '3.3x your bootstrap target. This move delivers outsized impact for your stage.',
                context: 'vs. $75K target',
                risk: 'Delaying costs $50K/week'
              },
              { 
                label: 'Time', 
                value: '21 days', 
                score: 70, 
                story: 'Within your 30-day window. Fast enough to see impact before next board meeting.',
                context: 'vs. 30-day max',
                risk: 'Current cycle: 68 days'
              },
              { 
                label: 'Energy', 
                value: 'Medium', 
                score: 75, 
                story: 'Requires sales ops focus but doesn\'t block other initiatives. Manageable for your team size.',
                context: '80 hours, 2 slots',
                risk: 'Needs dedicated owner'
              },
              { 
                label: 'Certainty', 
                value: '80%', 
                score: 80, 
                story: 'High confidence based on your data patterns and similar company outcomes. Low execution risk.',
                context: 'Strong evidence',
                risk: 'Requires sales buy-in'
              },
            ].map((metric) => (
              <div key={metric.label} className={`${c.bgCard} rounded-xl p-6 border ${c.border} ${isDark ? 'hover:border-[#F59E0B]/50' : 'hover:border-[#D97706]/50'} transition-colors`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-medium ${c.textMuted} uppercase tracking-wide`}>{metric.label}</span>
                  <span className={`text-2xl font-bold ${c.text}`}>{metric.value}</span>
                </div>
                <div className={`w-full ${c.bgSecondary} rounded-full h-2 mb-3`}>
                  <div 
                    className={`h-2 rounded-full transition-all ${c.accentBg}`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
                <div className="space-y-2">
                  <p className={`text-xs ${c.textSecondary} leading-relaxed`}>{metric.story}</p>
                  <div className={`text-xs ${c.textMuted}`}>
                    <span className="font-medium">{metric.context}</span>
                  </div>
                  <div className={`text-xs ${c.alert}`}>
                    <span className="font-medium">{metric.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Stack Timeline */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${c.textSecondary}`}>Strategy Stack</h2>
          <div className={`${c.bgCard} rounded-xl p-6 border ${c.border}`}>
            <div className="relative">
              {/* Timeline Line */}
              <div className={`absolute left-0 right-0 top-8 h-0.5 ${c.border}`}></div>
              
              {/* Timeline Items */}
              <div className="relative flex justify-between">
                {[
                  { week: 'Week 1', move: 'Sales qualification framework', status: 'active' },
                  { week: 'Week 2-3', move: 'Sales ops training', status: 'upcoming' },
                  { week: 'Week 4', move: 'CRM integration', status: 'upcoming' },
                  { week: 'Week 5+', move: 'Monitor & optimize', status: 'upcoming' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center" style={{ flex: 1 }}>
                    <div className={`w-4 h-4 rounded-full border-2 z-10 ${
                      item.status === 'active' 
                        ? `${c.accentBg} ${c.accentBorder}` 
                        : `${c.bgCard} ${c.border}`
                    }`}></div>
                    <div className="mt-4 text-center">
                      <div className={`text-xs font-medium ${c.textMuted} mb-1`}>{item.week}</div>
                      <div className={`text-sm ${c.textSecondary} max-w-[200px]`}>{item.move}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why This Over Others */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${c.textSecondary}`}>Why This Over Other Moves</h2>
          <div className={`${c.bgCard} rounded-xl p-6 border ${c.border}`}>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className={`text-sm font-medium ${c.textMuted} mb-2`}>Alternative: Hire more sales reps</div>
                <div className={`text-xs ${c.textMuted} mb-3`}>Would take 60+ days to ramp, costs $200K upfront</div>
                <div className={`text-xs ${c.alert}`}>Doesn't address root cause, higher risk</div>
              </div>
              <div>
                <div className={`text-sm font-medium ${c.textMuted} mb-2`}>Alternative: Improve product demo</div>
                <div className={`text-xs ${c.textMuted} mb-3`}>Lower impact ($120K), longer timeline (45 days)</div>
                <div className={`text-xs ${c.alert}`}>Lower ROI, doesn't fix qualification issue</div>
              </div>
              <div>
                <div className={`text-sm font-medium ${c.success} mb-2`}>This Move: Qualification framework</div>
                <div className={`text-xs ${c.textSecondary} mb-3`}>Higher impact ($250K), faster (21 days), addresses root cause</div>
                <div className={`text-xs ${c.success}`}>Best ROI, manageable effort, high certainty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Moves Grid */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${c.textSecondary}`}>Required Supporting Moves</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { 
                title: 'Hire sales ops lead', 
                score: 0.75, 
                priority: 'High',
                why: 'Needs dedicated owner to implement and maintain framework',
                blocker: 'Must complete before Week 2'
              },
              { 
                title: 'Update CRM workflows', 
                score: 0.68, 
                priority: 'Medium',
                why: 'Enables qualification scoring and tracking in your existing system',
                blocker: 'Can run parallel with framework design'
              },
              { 
                title: 'Create sales playbook', 
                score: 0.62, 
                priority: 'Medium',
                why: 'Documents qualification criteria and process for team consistency',
                blocker: 'Complete by Week 3 for training'
              },
            ].map((move, idx) => (
              <div key={idx} className={`${c.bgCard} rounded-xl p-6 border ${c.border} ${isDark ? 'hover:border-[#F59E0B]/50' : 'hover:border-[#D97706]/50'} transition-colors`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-lg font-semibold flex-1 ${c.text}`}>{move.title}</h3>
                  <span className={`text-xs px-2 py-1 ${c.bgSecondary} rounded ${c.textMuted}`}>{move.priority}</span>
                </div>
                <p className={`text-xs ${c.textMuted} mb-3 leading-relaxed`}>{move.why}</p>
                <div className={`text-xs ${c.alert} mb-3 font-medium`}>{move.blocker}</div>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 ${c.bgSecondary} rounded-full h-2`}>
                    <div 
                      className={`h-2 rounded-full ${c.accentBg}`}
                      style={{ width: `${move.score * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${c.textMuted}`}>{Math.round(move.score * 100)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StrategicCommandPreview() {
  return (
    <ThemeProvider>
      <StrategicCommandPreviewContent />
    </ThemeProvider>
  );
}
