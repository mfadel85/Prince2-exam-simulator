interface TimerProps {
  timeRemaining: number; // in seconds
}

export default function Timer({ timeRemaining }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const isUrgent = timeRemaining < 300; // Less than 5 minutes

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg font-mono text-lg ${
      isUrgent 
        ? 'bg-red-100 text-red-700' 
        : 'bg-blue-100 text-blue-700'
    }`}>
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
