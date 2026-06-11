'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const goodbyeItems = [
    'Missed deadlines & blockers.',
    'Hours digging through Slack.',
    'Endless status meetings.',
    'Information overload.',
    'Loose threads.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % goodbyeItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [goodbyeItems.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="text-2xl font-bold text-black tracking-tight">Konquer</div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-black transition-colors text-sm font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-black transition-colors text-sm font-medium">How It Works</a>
            <a href="#results" className="text-gray-700 hover:text-black transition-colors text-sm font-medium">Results</a>
            <a href="#demo" className="text-gray-700 hover:text-black transition-colors text-sm font-medium">Demo</a>
            <Link href="/dashboard" className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors">
              Get Started
            </Link>
          </div>
          <div className="md:hidden">
            <button className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="mb-6">
              <span className="text-sm font-semibold text-gray-600">For Founders & Busy Execs</span>
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-black mb-8 leading-tight tracking-tight">
              Your AI<br />
              Strategic Operating System
            </h1>
            <p className="text-2xl md:text-3xl text-gray-800 mb-6 max-w-3xl mx-auto leading-relaxed font-light">
              Wake up, see your move, and execute with confidence.
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              No more decision paralysis. No scattered priorities. No gut-feel guesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/dashboard" className="px-8 py-4 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-900 transition-colors">
                Get Started
              </Link>
              <a href="#how-it-works" className="px-8 py-4 bg-white text-black border-2 border-gray-300 rounded-lg text-lg font-semibold hover:border-black transition-colors">
                See How It Works
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <span>Zero Data Retention</span>
              <span>•</span>
              <span>SOC 2 Compliant</span>
            </div>
          </div>

          {/* Interactive Demo Mockup */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm font-medium text-gray-700">Konquer Dashboard</div>
                <div className="w-16"></div>
              </div>
              <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-600 mb-3">Ask Konquer Anything…</div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 bg-white">
                      <span className="text-gray-400 text-sm">What's my highest leverage move today?</span>
                    </div>
                    <button className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors text-sm">
                      Analyze
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="text-sm font-semibold text-gray-700 mb-4">
                    Based on your data this week:
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Revenue impact</span>
                      <span className="font-bold text-black">$280K new pipeline created</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">New opportunities</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-black">75 customers in pipeline</span>
                        <span className="text-green-600 font-semibold text-sm">↑12% week-over-week</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Blocked deals</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-black">2 enterprise deals in legal review</span>
                        <span className="text-orange-600 font-semibold text-sm">&gt;$100K each</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrates With Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-600 mb-8">Integrates with</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['Slack', 'Stripe', 'CRM', 'Calendar', 'Email'].map((item) => (
              <div key={item} className="text-gray-500 font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Goodbye Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl md:text-7xl font-bold text-black text-center mb-20">
            Wave goodbye to
          </h2>
          <div className="relative overflow-hidden h-32">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {goodbyeItems.map((item, index) => (
                <div key={index} className="min-w-full flex items-center justify-center h-full">
                  <h3 className="text-5xl md:text-6xl font-bold text-gray-900">{item}</h3>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + goodbyeItems.length) % goodbyeItems.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % goodbyeItems.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Product Features Section */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-bold text-black mb-6">
              Clarity Drives Speed. Konquer Delivers Both.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              One source of truth for founders: instant clarity, strategic moves, and flawless execution.
            </p>
          </div>

          <div className="space-y-40">
            {/* Feature 1 */}
            <div>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold text-gray-500 mb-4">Stay informed without another status meeting</p>
                <h3 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  Tasks managed, automatically
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Konquer captures every task across your workflow and keeps it moving. No missed follow-ups or buried to-dos, just seamless execution.
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <div className="bg-white rounded-xl p-6 shadow-sm space-y-5">
                    <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                      <div className="flex-1">
                        <h5 className="font-semibold text-black mb-1.5">Follow-up: KPI Dashboard Access</h5>
                        <p className="text-sm text-gray-600">From: Alex (Product Team)</p>
                        <p className="text-sm text-gray-500 mt-2">Requesting read access to revenue metrics for quarterly review.</p>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2.5 py-1 rounded font-semibold">Medium</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs px-4 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800">Create To-Do</button>
                      <button className="text-xs px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50">Ask Konquer</button>
                      <button className="text-xs px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50">Mark Done</button>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-black">Product Hunt launch metrics update</h5>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">High</span>
                          </div>
                          <p className="text-xs text-gray-500">8.3K views, 58% activation rate. Top 5 product of the day!</p>
                          <p className="text-xs text-gray-400 mt-1.5">6h ago • Growth</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold text-gray-500 mb-4">Great leaders don't react - they anticipate.</p>
                <h3 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  Performance in focus
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Konquer monitors every KPI, project, and dependency—alerting you the moment performance slips.
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Reach $100K MRR</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">On Track</span>
                          <span className="text-lg font-bold text-black">78%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-black h-2.5 rounded-full transition-all" style={{ width: '78%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Owner: You • $78K/$100K</div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 mb-2">Linked Projects</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Enterprise Client Pilot</span>
                            <span className="text-green-600 font-semibold">Active</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Strategic Partnership Deal</span>
                            <span className="text-green-600 font-semibold">Active</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 mb-2">Active Blockers</div>
                        <div className="text-sm text-green-600 font-semibold">No blockers!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-bold text-black mb-6">
              From Chaos to Clarity in 3 Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Zero setup. Total alignment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { num: '01', title: 'Connect your tools', desc: 'We plug into the tools your team already uses: Slack, Stripe, CRM, Calendar, and more. Your data stays yours, always.' },
              { num: '02', title: 'See your move', desc: 'Konquer analyzes signals, calculates leverage, and surfaces the single highest-impact move. No guessing. Just clarity.' },
              { num: '03', title: 'Execute & learn', desc: "Everything's prepared. You execute. We track outcomes and refine the system to get smarter with every move." }
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-10 border border-gray-200 shadow-sm">
                <div className="text-7xl font-bold text-gray-200 mb-6 leading-none">{step.num}</div>
                <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-bold text-black mb-6">
              Move faster. Lead smarter. Execute flawlessly.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Konquer removes the mental load of strategic decision-making—giving founders the clarity to focus on what actually drives growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Stay Updated.', desc: 'Real-time updates on what you care about—no digging through dashboards or scattered tools.' },
              { title: 'Never Miss a Deadline.', desc: 'Konquer identifies every opportunity, calculates leverage, and ensures nothing stalls.' },
              { title: 'Stay Ahead of Risks.', desc: 'Blockers are surfaced instantly so KPIs stay on track and opportunities don\'t slip away.' },
              { title: 'Own Your Time', desc: 'Konquer organizes your priorities around impact: prep before, execution during, learning after.' }
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-10 border border-gray-200">
                <h3 className="text-2xl font-bold text-black mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-bold mb-8">
            Get Your Strategic Clarity Back
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join founders who've eliminated decision paralysis and execute with confidence.
          </p>
          <Link href="/dashboard" className="inline-block px-10 py-5 bg-white text-black rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-3xl font-bold text-black mb-4">Konquer</div>
            <p className="text-gray-600 text-sm">The strategic operating system for founders.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors cursor-not-allowed opacity-60">Process</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors cursor-not-allowed opacity-60">Services</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors cursor-not-allowed opacity-60">Benefits</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors cursor-not-allowed opacity-60">Plans</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors cursor-not-allowed opacity-60">Contact</a>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">Questions? Email us at founders@konquer.io</p>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors cursor-not-allowed opacity-60">Terms and Services</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors cursor-not-allowed opacity-60">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
