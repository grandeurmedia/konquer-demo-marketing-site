"use client";

import ValueEquationDashboard from "../components/ValueEquationDashboard";

/**
 * Value Equation Dashboard Page
 * 
 * Clean, minimalist display of real-time value metrics
 */
export default function ValueEquationPage() {
  // Example with custom data (in production, fetch from API)
  const customData = {
    money: {
      saved: 18750,
      perMonth: 3125
    },
    time: {
      savedMinutes: 1200,
      perDay: 25,
      perWeek: 90,
      perMonth: 1200,
      yearsEquivalent: 3
    },
    energy: {
      score: 82,
      reduction: 42
    },
    certainty: {
      score: 88,
      improvement: 38
    },
    overall: {
      valueScore: 86,
      trend: "up" as const
    }
  };

  return <ValueEquationDashboard data={customData} />;
}
