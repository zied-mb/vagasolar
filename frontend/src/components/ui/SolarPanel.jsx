const SolarPanel = () => (
  <svg viewBox="0 0 100 100" className="text-gray-800 dark:text-gray-700">
    <rect x="5" y="5" width="90" height="90" rx="5" fill="currentColor" />
    <rect x="10" y="10" width="80" height="80" rx="2" fill="#1e293b" />
    <g fill="none" stroke="#f59e0b" strokeWidth="0.5">
      {[...Array(8)].map((_, i) => (
        <rect key={i} x={15 + i * 10} y="15" width="5" height="70" />
      ))}
    </g>
  </svg>
);

export default SolarPanel;
