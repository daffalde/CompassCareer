export function CircularProgress({ size, progress, strokeWidth = 20 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#00f2fe" />
        </linearGradient>
      </defs>

      <circle
        stroke="#eee"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="url(#grad)"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="50"
        fontWeight="700"
        fill="url(#grad)"
      >
        {progress}%
      </text>
    </svg>
  );
}
