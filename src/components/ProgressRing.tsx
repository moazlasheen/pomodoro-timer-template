import React from 'react';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number; // 0 to 1
  color: string;
  trackColor?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  radius,
  stroke,
  progress,
  color,
  trackColor = '#E6DFD3',
}) => {
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      className="absolute inset-0"
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        stroke={trackColor}
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {/* Progress */}
      <circle
        className="progress-ring-circle"
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

export default ProgressRing;
