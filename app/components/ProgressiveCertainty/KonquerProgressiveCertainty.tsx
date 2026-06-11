'use client';

import React, { useState } from 'react';

// Konquer Progressive Certainty Display
// Apple-inspired minimalism + CERTAINTY principle
// Progressive disclosure for calm, focused experience
const KonquerProgressiveCertainty = () => {
  const [expandLevel, setExpandLevel] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        
        {/* Layer 1: Primary Action - Konquer Minimal Design */}
        <div 
          className="cursor-pointer transition-all duration-500 ease-out"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setExpandLevel(expandLevel === 1 ? 0 : 1)}
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
          </div>
          
          {/* Confidence Indicator - Subtle Blue */}
          <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden mb-8">
            <div 
              className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-1000 ease-out"
              style={{ width: `${isHovering ? konquerMove.layer_1.confidence : 0}%` }}
            />
          </div>
          
          {/* Expand Prompt - Calm, Supportive */}
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center space-x-2 group">
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

        {/* Layer 2: Strategic Insight - Appears on Expand */}
        <div className={`transition-all duration-500 ease-out ${
          expandLevel >= 1 
            ? 'opacity-100 max-h-96 mt-10' 
            : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="border-l-2 border-blue-600 pl-6">
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">Why this move first</h2>
            
            <p className="text-base font-normal text-gray-700 leading-relaxed mb-4">
              {konquerMove.layer_2.insight}
            </p>
            
            <p className="text-base font-semibold text-gray-900 leading-relaxed">
              {konquerMove.layer_2.leverage}
            </p>
            
            {/* Deeper Dive Option */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setExpandLevel(expandLevel === 2 ? 1 : 2);
              }}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center space-x-2 group"
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

        {/* Layer 3: Compound Effect - Deepest Level */}
        <div className={`transition-all duration-500 ease-out ${
          expandLevel >= 2 
            ? 'opacity-100 max-h-[500px] mt-10' 
            : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="space-y-8">
            {/* Compound Timeline */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-6 font-medium">How this compounds</h3>
              <div className="space-y-4">
                {konquerMove.layer_3.compound.map((milestone, idx) => (
                  <div key={idx} className="flex items-center space-x-4 group">
                    <div className="w-2 h-2 bg-blue-600 rounded-full group-hover:bg-teal-600 transition-colors duration-300" />
                    <div className="flex-1 flex justify-between items-baseline">
                      <span className="text-sm text-gray-500 font-medium">{milestone.time}</span>
                      <span className="text-base font-normal text-gray-700">{milestone.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Leverage Mathematics */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-6 font-medium">The leverage equation</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Your Input</div>
                  <div className="text-lg font-semibold text-black">{konquerMove.layer_3.math.your_input}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Creates</div>
                  <div className="text-lg font-semibold text-green-600">{konquerMove.layer_3.math.output_value}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Confidence</div>
                  <div className="text-lg font-semibold text-blue-600">{konquerMove.layer_3.math.probability_shift}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kong's Voice - Supportive Footer */}
        <div className={`transition-all duration-500 ease-out ${
          expandLevel > 0 ? 'opacity-100 mt-12' : 'opacity-0 mt-8'
        }`}>
          <div className="border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500 font-normal italic">
              {expandLevel === 0 && "Kong: This is your cleanest win today. I'm here if you want to understand why."}
              {expandLevel === 1 && "Kong: Smart question. This move protects cash flow and gets you a win today."}
              {expandLevel === 2 && "Kong: Now you see it. This one move compounds into time for growth moves."}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default KonquerProgressiveCertainty;
