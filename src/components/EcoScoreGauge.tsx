interface Props {
  score: number; // 0-100
  label?: string;
}

export function EcoScoreGauge({ score, label }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = 64;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;
  const color =
    clamped >= 70
      ? "var(--leaf)"
      : clamped >= 40
        ? "var(--sand)"
        : "var(--destructive)";

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={`Eco score: ${clamped} out of 100`}
    >
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="14"
        />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 800ms ease" }}
        />
      </svg>
      <div className="-mt-28 flex flex-col items-center">
        <span className="font-display text-4xl font-bold">{clamped}</span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Eco Score
        </span>
      </div>
      {label && (
        <span className="mt-12 rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
          {label}
        </span>
      )}
    </div>
  );
}
