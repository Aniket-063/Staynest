export default function SuccessCheckmark() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-5">
      <style>{`
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pop-in-check {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ping-ring-1 {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes ping-ring-2 {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.3); opacity: 0; }
        }
        .checkmark-svg {
          animation: pop-in-check 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .checkmark-circle {
          stroke-dasharray: 289;
          stroke-dashoffset: 289;
          animation: draw-circle 0.6s ease-out forwards;
        }
        .checkmark-tick {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: draw-check 0.4s ease-out 0.55s forwards;
        }
        .ping-ring-1 {
          animation: ping-ring-1 1.6s cubic-bezier(0,0,0.2,1) infinite;
        }
        .ping-ring-2 {
          animation: ping-ring-2 1.6s cubic-bezier(0,0,0.2,1) 0.3s infinite;
        }
      `}</style>

      {/* Pulse rings */}
      <span className="ping-ring-1 absolute inset-0 rounded-full bg-green-400/30" />
      <span className="ping-ring-2 absolute inset-0 rounded-full bg-green-400/20" />

      {/* Circle + check */}
      <svg viewBox="0 0 100 100" className="checkmark-svg relative w-24 h-24">
        <circle
          cx="50" cy="50" r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="checkmark-circle text-green-500 dark:text-green-400"
          strokeLinecap="round"
        />
        <path
          d="M28 52 L43 67 L74 34"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="checkmark-tick text-green-500 dark:text-green-400"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}