"use client";

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  label?: string;
}

export default function ProgressCircle({
  percentage,
  size = 120,
  label,
}: ProgressCircleProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (clampedPercentage / 100) * circumference;

  const getColor = (pct: number): string => {
    if (pct >= 70) return "#22c55e"; // green-500
    if (pct >= 40) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  const getTrackColor = (pct: number): string => {
    if (pct >= 70) return "#dcfce7"; // green-100
    if (pct >= 40) return "#fef9c3"; // yellow-100
    return "#fee2e2"; // red-100
  };

  const color = getColor(clampedPercentage);
  const trackColor = getTrackColor(clampedPercentage);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          aria-label={`Progression: ${Math.round(clampedPercentage)}%`}
          role="progressbar"
          aria-valuenow={Math.round(clampedPercentage)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold"
            style={{
              color,
              fontSize: size * 0.22,
            }}
          >
            {Math.round(clampedPercentage)}%
          </span>
        </div>
      </div>

      {label && (
        <span className="text-sm font-medium text-gray-600 text-center">
          {label}
        </span>
      )}
    </div>
  );
}
