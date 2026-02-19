import { useState, useEffect } from 'react';

// Event: 28 Feb 2026, 02:00 PM (IST)
const EVENT_DATE = new Date('2026-02-28T14:00:00+05:30');

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function CountdownTicker() {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const d = EVENT_DATE - now;
      if (d <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }
      const days = Math.floor(d / (1000 * 60 * 60 * 24));
      const hours = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((d % (1000 * 60)) / 1000);
      setDiff({ days, hours, minutes, seconds, isPast: false });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (diff.isPast) {
    return (
      <div className="countdown-ticker inline-flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
        <span className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">
          Event day! See you there 🎉
        </span>
      </div>
    );
  }

  const units = [
    { value: diff.days, label: 'Days' },
    { value: diff.hours, label: 'Hours' },
    { value: diff.minutes, label: 'Mins' },
    { value: diff.seconds, label: 'Secs' },
  ];

  return (
    <div className="countdown-ticker inline-flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6" role="timer" aria-live="polite">
      {units.map(({ value, label }) => (
        <div
          key={label}
          className="countdown-unit flex flex-col items-center min-w-[64px] sm:min-w-[72px] px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-white/60 shadow-lg"
        >
          <span className="countdown-value text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-holi-magenta to-holi-yellow tabular-nums">
            {pad(value)}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
