// A self-contained editorial banner (no external images) — a warm café scene
// drawn in the brand palette. Stands in for the venue photo.
export function CafeBanner({ venueName }: { venueName: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-surface-variant">
      <svg viewBox="0 0 400 240" className="w-full h-auto block" role="img" aria-label={`${venueName} café`}>
        <rect width="400" height="240" fill="#f0eded" />
        {/* wall */}
        <rect width="400" height="150" fill="#eae7e7" />
        {/* windows with warm morning light */}
        <rect x="24" y="26" width="150" height="98" rx="4" fill="#fcf9f8" />
        <rect x="24" y="26" width="150" height="98" rx="4" fill="none" stroke="#c2c8c2" />
        <line x1="99" y1="26" x2="99" y2="124" stroke="#c2c8c2" />
        <line x1="24" y1="75" x2="174" y2="75" stroke="#c2c8c2" />
        {/* hanging plant */}
        <line x1="300" y1="18" x2="300" y2="52" stroke="#727973" strokeWidth="1.5" />
        <ellipse cx="300" cy="62" rx="22" ry="16" fill="#2d4739" />
        <ellipse cx="288" cy="56" rx="10" ry="8" fill="#173124" />
        <ellipse cx="312" cy="58" rx="9" ry="7" fill="#173124" />
        {/* counter */}
        <rect x="0" y="150" width="400" height="90" fill="#2c2c28" />
        <rect x="0" y="150" width="400" height="10" fill="#42423d" />
        {/* espresso machine */}
        <rect x="210" y="104" width="90" height="48" rx="4" fill="#99462a" />
        <rect x="222" y="114" width="66" height="16" rx="2" fill="#fe9572" />
        <rect x="238" y="130" width="8" height="18" fill="#2c2c28" />
        <rect x="266" y="130" width="8" height="18" fill="#2c2c28" />
        {/* coffee bags */}
        <rect x="120" y="120" width="26" height="32" rx="2" fill="#fcf9f8" />
        <rect x="120" y="120" width="26" height="10" fill="#173124" />
        <rect x="152" y="124" width="26" height="28" rx="2" fill="#ffb59e" />
        {/* cup + saucer */}
        <ellipse cx="64" cy="150" rx="30" ry="7" fill="#1c1b1b" opacity="0.15" />
        <path d="M50 132 h28 a3 3 0 0 1 3 3 v6 a17 8 0 0 1 -34 0 v-6 a3 3 0 0 1 3 -3 z" fill="#fcf9f8" />
        <path d="M81 135 h6 a7 7 0 0 1 0 12 h-4" fill="none" stroke="#fcf9f8" strokeWidth="3" />
        {/* steam */}
        <path d="M60 122 q4 -6 0 -12 q-4 -6 0 -12" fill="none" stroke="#b0cdbb" strokeWidth="2" opacity="0.7" />
        <path d="M70 122 q4 -6 0 -12 q-4 -6 0 -12" fill="none" stroke="#b0cdbb" strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  );
}
