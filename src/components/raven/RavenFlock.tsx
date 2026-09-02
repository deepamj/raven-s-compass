const birds = [
  { top: "14%", scale: 1, duration: 78, delay: 0, beat: 3.4 },
  { top: "22%", scale: 0.7, duration: 96, delay: -22, beat: 4.1 },
  { top: "31%", scale: 0.55, duration: 112, delay: -48, beat: 4.8 },
  { top: "58%", scale: 0.85, duration: 88, delay: -64, beat: 3.8 },
  { top: "68%", scale: 0.5, duration: 124, delay: -12, beat: 5.2 },
  { top: "44%", scale: 0.62, duration: 104, delay: -86, beat: 4.4 },
];

/**
 * Slow, low-contrast silhouettes drifting across the background.
 * Purely decorative; hidden for reduced-motion users.
 */
export function RavenFlock({ action }: { action?: "explore" | "contribute" | "click" | null }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {birds.map((b, i) => {
        const isExploreTarget = i % 2 === 0;
        const isContributeTarget = i % 2 !== 0;

        let transform = "translateY(0) rotate(0) scale(1)";
        if (action === "explore" && isExploreTarget) {
          transform = "translateY(-15px) rotate(-6deg) scale(1.05)";
        } else if (action === "contribute" && isContributeTarget) {
          transform = "translateY(15px) rotate(4deg) scale(0.95)";
        } else if (action === "click") {
          transform = `translateY(-30px) rotate(${i % 2 === 0 ? -15 : 15}deg) scale(1.1)`;
        }

        return (
          <span
            key={i}
            className="flock-bird"
            style={{
              top: b.top,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            }}
          >
            <div 
              className="transition-transform duration-[2000ms] ease-out"
              style={{ transform }}
            >
              <svg
                width={38 * b.scale}
                height={14 * b.scale}
                viewBox="0 0 38 14"
                fill="none"
                style={{ animation: `wing-beat ${b.beat}s ease-in-out infinite` }}
              >
                <path
                  d="M1 9C5.5 9 8.5 2.5 12 2.5c2.8 0 4.6 4.2 7 4.2s4.2-4.2 7-4.2C29.5 2.5 32.5 9 37 9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </span>
        );
      })}
    </div>
  );
}
