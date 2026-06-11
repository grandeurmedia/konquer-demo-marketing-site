'use client';

import React, { useState } from 'react';

// Konquer Progressive Certainty Hybrid
// Combines progressive disclosure with action-oriented flow
// Apple-inspired minimalism + CERTAINTY + WOW experience
const KonquerProgressiveCertaintyHybrid = () => {
  const [expandLevel, setExpandLevel] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isCommitted, setIsCommitted] = useState(false);

  const konquerMove = {
    layer_1: {
      primary: "Raise price floor to $25K minimum for all new deals",
      context: "This single action secures $18K in revenue and saves 12 hours",
      timeline: "30 minutes",
      effort: "Low energy",
      value: "$18K",
      confidence: 97
    },
    layer_2: {
      insight: "Every deal you close after this decision is more profitable. This single change filters out time-wasters, positions you as premium, and builds a pipeline on real margin—not volume. Make the move now, and next quarter's revenue funds growth instead of covering costs.",
      leverage: "Closing this renewal protects your cash flow and gives you a quick win to start your day. Those 12 hours you save compound into time for moves that create leverage, not just maintain it."
    },
    layer_3: {
      compound: [
        { time: "Today", impact: "$18K secured, 12h saved" },
        { time: "This week", impact: "Cash flow protected, focus freed" },
        { time: "This month", impact: "No replacement revenue needed" },
        { time: "This quarter", impact: "Time compounds into growth moves" }
      ],
      math: {
        your_input: "30 minutes",
        output_value: "$18K secured + 12h freed",
        probability_shift: "97% confidence"
      }
    }
  };


  const handleBeginDay = () => {
    setIsCommitted(true);
  };

  const resetDemo = () => {
    setIsCommitted(false);
    setExpandLevel(0);
  };

  // Dynamic personalized greeting like Claude/ChatGPT
  const getGreeting = () => {
    const hour = new Date().getHours();
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // For now using placeholder - in production this would come from user data
    const userName = '[Name]';
    
    // Context about current move (in production, this would come from user's actual data)
    const currentMove = "Sarah's renewal";
    const moveValue = "$18K";
    
    // Return greetings (when user comes back after being away) - Priority
    // In production, would check last visit time
    const returnGreetings = [
      `${userName} returns!`,
      `Welcome back, ${userName}.`,
      `Hey ${userName}, you're back.`
    ];
    
    // Personalized morning greetings (before 12pm)
    const morningGreetings = [
      `Good morning, ${userName}.`,
      `Morning, ${userName}.`,
      `Hey ${userName}, good morning!`
    ];
    
    // Personalized afternoon greetings (12pm - 5pm)
    const afternoonGreetings = [
      `Good afternoon, ${userName}.`,
      `Hey ${userName}, good afternoon!`
    ];
    
    // Personalized evening greetings (after 5pm)
    const eveningGreetings = [
      `Good evening, ${userName}.`,
      `Hey ${userName}, good evening.`
    ];
    
    // Check if this is a return visit (in production, would check last visit timestamp)
    // Example: lastVisit was > 24 hours ago = return visit
    const isReturnVisit = false; // Would check: lastVisit was > 24 hours ago
    
    let greetings: string[];
    if (isReturnVisit) {
      // User has been away - show return greeting
      greetings = returnGreetings;
    } else if (hour < 12) {
      greetings = morningGreetings;
    } else if (hour < 17) {
      greetings = afternoonGreetings;
    } else {
      greetings = eveningGreetings;
    }
    
    // Use day of year + hour to create variety that changes but stays consistent
    const index = (dayOfYear + hour) % greetings.length;
    return greetings[index];
  };


  // Committed State - Show after clicking "Begin My Day"
  if (isCommitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8 py-20">
        <div className="max-w-2xl w-full">
          {/* Dynamic Greeting */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-black">{getGreeting()}</h2>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Status Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-black">Your Move is Set</h1>
                <p className="text-sm text-gray-500">Call with Sarah at 2pm</p>
              </div>
            </div>

            {/* Preparation Status */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Calendar blocked for 2pm</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Sarah's notes and contract ready</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Reminder set for 1:45pm</span>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-200 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-black mb-1">$18K</div>
                <div className="text-xs text-gray-500">Money</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black mb-1">30min</div>
                <div className="text-xs text-gray-500">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black mb-1">Low</div>
                <div className="text-xs text-gray-500">Energy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black mb-1">97%</div>
                <div className="text-xs text-gray-500">Confidence</div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-900">What's next:</span> We'll remind you 15 minutes before your call. Everything you need will be ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8 py-20 overflow-visible">
      <div className="relative w-full max-w-2xl" style={{ paddingBottom: expandLevel >= 2 ? '200px' : expandLevel >= 1 ? '100px' : '0' }}>
        
        {/* Dynamic Greeting */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-black">{getGreeting()}</h2>
        </div>

        {/* Section Title */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-normal text-black">Today's Strategic Move:</h3>
        </div>
        
        {/* Card Container - Wraps Layer 1 and Layer 2 for proper positioning */}
        <div className="relative">
          {/* Layer 1: Base Card - Solid White */}
          <div 
            className="relative bg-white rounded-2xl p-8 transition-all duration-500 ease-out"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              transform: expandLevel >= 2 ? 'translateY(-40px)' : expandLevel >= 1 ? 'translateY(-20px)' : 'translateY(0)',
              zIndex: expandLevel >= 2 ? 10 : expandLevel >= 1 ? 10 : 30,
              boxShadow: expandLevel >= 2 ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : expandLevel >= 1 ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
          {/* Main Action - Clean Typography */}
          <h1 className="text-3xl font-semibold text-black mb-4 tracking-tight leading-tight">
            {konquerMove.layer_1.primary}
          </h1>
          
          {/* Context Line */}
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            {konquerMove.layer_1.context}
          </p>
          
          {/* Key Metrics - Horizontal Display */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time</span>
              <span className="text-xl font-semibold text-black">{konquerMove.layer_1.timeline}</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">Energy</span>
              <span className="text-xl font-semibold text-black">{konquerMove.layer_1.effort}</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">Value</span>
              <span className="text-xl font-semibold text-green-600">{konquerMove.layer_1.value}</span>
            </div>
            <div className="flex items-center space-x-2 ml-8">
              <div 
                className="w-2 h-2 rounded-full bg-red-500 neon-blink" 
                style={{ 
                  boxShadow: '0 0 6px rgba(239, 68, 68, 0.8), 0 0 8px rgba(239, 68, 68, 0.6), 0 0 10px rgba(239, 68, 68, 0.4)'
                }}
              ></div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-900 via-blue-800 to-black bg-clip-text text-transparent">Highest Priority</span>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes neon-blink {
                0%, 100% { 
                  opacity: 1; 
                  box-shadow: 0 0 6px rgba(239, 68, 68, 0.8), 0 0 8px rgba(239, 68, 68, 0.6), 0 0 10px rgba(239, 68, 68, 0.4); 
                }
                50% { 
                  opacity: 0.3; 
                  box-shadow: 0 0 3px rgba(239, 68, 68, 0.4), 0 0 4px rgba(239, 68, 68, 0.3), 0 0 5px rgba(239, 68, 68, 0.2); 
                }
              }
              .neon-blink {
                animation: neon-blink 1.5s ease-in-out infinite;
              }
            `}} />
          </div>
          
          {/* Confidence Indicator - Subtle Blue */}
          <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden mb-8">
            <div 
              className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-1000 ease-out"
              style={{ width: `${isHovering ? konquerMove.layer_1.confidence : 0}%` }}
            />
          </div>
          
          {/* Action Button - Primary CTA */}
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleBeginDay}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Begin My Day
            </button>
            
            {/* Expand Prompt - Calm, Supportive */}
            <button 
              onClick={() => {
                const newLevel = expandLevel === 1 ? 0 : 1;
                setExpandLevel(newLevel);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center space-x-2 group"
            >
              <span>{expandLevel > 0 ? 'More Clarity' : 'Why this move first?'}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${expandLevel > 0 ? 'rotate-90' : 'group-hover:translate-x-1'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          </div>

          {/* Layer 2: Strategic Insight - Frosted Glass Card */}
          <div 
            className={`absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-500 ease-out ${
              expandLevel >= 1 
                ? 'opacity-100 pointer-events-auto' 
                : 'opacity-0 pointer-events-none invisible'
            }`}
            style={{
              transform: expandLevel >= 2 
                ? 'translateY(-40px)' 
                : 'translateY(0)',
              zIndex: expandLevel >= 1 ? 20 : 0,
              boxShadow: expandLevel >= 1 ? '0 15px 20px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.06)' : 'none'
            }}
          >
          {/* Navigation Controls */}
          <div className="flex items-center justify-end gap-3 mb-6">
            <button
              onClick={() => setExpandLevel(0)}
              className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="pl-6">
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">Why this move first</h2>
            
            <p className="text-base font-normal text-gray-700 leading-relaxed mb-4">
              {konquerMove.layer_2.insight}
            </p>
            
            <p className="text-base font-semibold text-gray-900 leading-relaxed mb-6">
              {konquerMove.layer_2.leverage}
            </p>
            
            {/* Deeper Dive Option */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const newLevel = expandLevel === 2 ? 1 : 2;
                setExpandLevel(newLevel);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center space-x-2 group"
            >
              <span>{expandLevel === 2 ? 'Got it' : 'See the compounding effect'}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${expandLevel === 2 ? 'rotate-90' : 'group-hover:translate-x-1'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          </div>

          {/* Layer 3: Compound Effect - Frosted Glass Card */}
          <div 
            className={`absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-500 ease-out ${
              expandLevel >= 2 
                ? 'opacity-100 pointer-events-auto' 
                : 'opacity-0 pointer-events-none invisible'
            }`}
            style={{
              transform: expandLevel >= 2 
                ? 'translateY(-40px)' 
                : 'translateY(0)',
              zIndex: expandLevel >= 2 ? 30 : 0,
              boxShadow: expandLevel >= 2 ? '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 12px -5px rgba(0, 0, 0, 0.08)' : 'none'
            }}
          >
          {/* Navigation Controls */}
          <div className="flex items-center justify-end gap-3 mb-6">
            <button
              onClick={() => setExpandLevel(1)}
              className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors duration-200"
              aria-label="Back"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setExpandLevel(0)}
              className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div>
            {/* Compound Timeline */}
            <div className="mb-0 pb-0 -mb-4">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-6 font-medium">How this compounds</h3>
              <div className="space-y-5">
                {konquerMove.layer_3.compound.map((milestone, idx) => (
                  <div key={idx} className="flex items-start space-x-4 group">
                    <div className="w-2 h-2 bg-blue-600 rounded-full group-hover:bg-teal-600 transition-colors duration-300 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 grid grid-cols-[100px_1fr] gap-8 items-baseline">
                      <span className="text-sm text-gray-500 font-medium leading-tight">{milestone.time}</span>
                      <span className="text-base font-normal text-gray-700 leading-tight">{milestone.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Leverage Mathematics */}
            <div className="border-t border-gray-100 pt-8 pb-16">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-6 font-medium">Leverage Gained</h3>
              <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500 mb-3 uppercase tracking-wide h-4 flex items-end">Your Input</div>
                  <div className="text-lg font-semibold text-black leading-tight min-h-[28px] flex items-start">{konquerMove.layer_3.math.your_input}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500 mb-3 uppercase tracking-wide h-4 flex items-end">Creates</div>
                  <div className="text-lg font-semibold text-green-600 leading-tight min-h-[28px] flex flex-col justify-start">
                    <div>$18K secured</div>
                    <div>+ 12h freed</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500 mb-3 uppercase tracking-wide h-4 flex items-end">Confidence</div>
                  <div className="text-lg font-semibold text-blue-600 leading-tight min-h-[28px] flex items-start">{konquerMove.layer_3.math.probability_shift}</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Kong's Voice - Supportive Footer (only visible when expanded) */}
        {expandLevel > 0 && (
          <div className="absolute -bottom-24 left-0 right-0 text-center transition-all duration-500 ease-out z-40">
            <div className="border-t border-gray-200 pt-6 inline-block px-4 bg-transparent">
              <p className="text-sm text-gray-500 font-normal italic">
                {expandLevel === 1 && "Kong: Smart question. This move protects cash flow and gets you a win today."}
                {expandLevel === 2 && "Kong: Now you see it. This one move compounds into time for growth moves."}
              </p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default KonquerProgressiveCertaintyHybrid;
