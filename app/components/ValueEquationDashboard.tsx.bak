"use client";

/**
 * ValueEquationDashboard
 * 
 * Professional metrics dashboard with intentional color usage
 * Blue = current/ongoing metrics, Green = totals/achievements
 */

interface MetricCardProps {
  title: string;
  primaryValue: string | number;
  primaryLabel: string;
  secondaryValue?: string | number;
  secondaryLabel?: string;
  primaryColor?: "blue" | "green";
  secondaryColor?: "blue" | "green";
  showProgress?: boolean;
  progressValue?: number; // 0-100
  icon?: React.ReactNode;
}

function MetricCard({
  title,
  primaryValue,
  primaryLabel,
  secondaryValue,
  secondaryLabel,
  primaryColor = "blue",
  secondaryColor = "green",
  showProgress = false,
  progressValue = 0,
  icon
}: MetricCardProps) {
  const primaryColorClass = primaryColor === "blue" ? "text-blue-400" : "text-green-400";
  const secondaryColorClass = secondaryColor === "blue" ? "text-blue-400" : "text-green-400";
  
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      {/* Header with title and icon */}
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-white text-lg font-medium">
          {title}
        </h3>
        {icon && (
          <div className="text-white">
            {icon}
          </div>
        )}
      </div>

      {/* Metrics Container */}
      <div className="flex items-end gap-8 mb-3">
        {/* Primary Metric */}
        <div>
          <div className={`text-6xl font-bold ${primaryColorClass} leading-none mb-1`}>
            {primaryValue}
          </div>
          <div className="text-gray-400 text-xs uppercase tracking-wider">
            {primaryLabel}
          </div>
        </div>

        {/* Secondary Metric */}
        {secondaryValue !== undefined && (
          <div>
            <div className={`text-5xl font-bold ${secondaryColorClass} leading-none mb-1`}>
              {typeof secondaryValue === 'number' && secondaryValue > 0 ? '+' : ''}
              {secondaryValue}
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">
              {secondaryLabel}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              primaryColor === "blue" 
                ? "bg-gradient-to-r from-blue-500 to-blue-400" 
                : "bg-green-400"
            }`}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Simple icon component
function FlagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

interface ValueEquationData {
  money: {
    saved: number;
    perMonth: number;
  };
  time: {
    savedMinutes: number;
    perDay: number;
    perWeek: number;
    perMonth: number;
    yearsEquivalent: number;
  };
  energy: {
    score: number; // 0-100
    reduction: number; // percentage
  };
  certainty: {
    score: number; // 0-100
    improvement: number; // percentage
  };
  overall: {
    valueScore: number; // 0-100
    trend: "up" | "down" | "stable";
  };
}

interface ValueEquationDashboardProps {
  data?: ValueEquationData;
}

const defaultData: ValueEquationData = {
  money: {
    saved: 12500,
    perMonth: 2500
  },
  time: {
    savedMinutes: 840,
    perDay: 20,
    perWeek: 60,
    perMonth: 840,
    yearsEquivalent: 2
  },
  energy: {
    score: 78,
    reduction: 35
  },
  certainty: {
    score: 85,
    improvement: 42
  },
  overall: {
    valueScore: 82,
    trend: "up"
  }
};

export default function ValueEquationDashboard({
  data = defaultData
}: ValueEquationDashboardProps) {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Value Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Real-time metrics tracking your impact
          </p>
        </div>

        {/* Grid of metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Time Saved - Daily/Weekly with Progress */}
          <MetricCard
            title="Time Saved"
            primaryValue={data.time.perDay}
            primaryLabel="MINS /DAY"
            secondaryValue={data.time.perWeek}
            secondaryLabel="MINS /WEEK"
            primaryColor="blue"
            secondaryColor="blue"
            showProgress={true}
            progressValue={65}
            icon={<FlagIcon />}
          />

          {/* Time Saved - Monthly Total with Progress */}
          <MetricCard
            title="Time Saved"
            primaryValue={data.time.savedMinutes}
            primaryLabel="TOTAL MINS /MONTH"
            secondaryValue={data.time.yearsEquivalent}
            secondaryLabel="YEARS SAVED"
            primaryColor="blue"
            secondaryColor="green"
            showProgress={true}
            progressValue={100}
            icon={<FlagIcon />}
          />

          {/* Money Saved */}
          <MetricCard
            title="Money Saved"
            primaryValue={`$${data.money.saved.toLocaleString()}`}
            primaryLabel="TOTAL SAVED"
            secondaryValue={`$${data.money.perMonth.toLocaleString()}`}
            secondaryLabel="PER MONTH"
            primaryColor="green"
            secondaryColor="blue"
            icon={<FlagIcon />}
          />

          {/* Energy Score */}
          <MetricCard
            title="Energy"
            primaryValue={data.energy.score}
            primaryLabel="CURRENT SCORE"
            secondaryValue={`${data.energy.reduction}%`}
            secondaryLabel="REDUCTION"
            primaryColor="green"
            secondaryColor="blue"
            icon={<FlagIcon />}
          />

          {/* Certainty Score */}
          <MetricCard
            title="Certainty"
            primaryValue={data.certainty.score}
            primaryLabel="CONFIDENCE LEVEL"
            secondaryValue={`${data.certainty.improvement}%`}
            secondaryLabel="IMPROVEMENT"
            primaryColor="green"
            secondaryColor="blue"
            icon={<FlagIcon />}
          />

          {/* Overall Value */}
          <MetricCard
            title="Overall Value"
            primaryValue={data.overall.valueScore}
            primaryLabel="VALUE SCORE"
            secondaryValue={data.overall.trend === "up" ? "↗ UP" : data.overall.trend === "down" ? "↘ DOWN" : "→ STABLE"}
            secondaryLabel="TREND"
            primaryColor="green"
            secondaryColor="green"
            icon={<FlagIcon />}
          />
        </div>
      </div>
    </div>
  );
}
