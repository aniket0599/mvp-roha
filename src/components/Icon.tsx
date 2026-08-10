// Thin wrapper over Material Symbols (loaded globally in layout.tsx).
export function Icon({
  name,
  className = "",
  filled = false,
  style,
}: {
  name: string;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined${filled ? " filled" : ""} ${className}`}
      style={style}
    >
      {name}
    </span>
  );
}
