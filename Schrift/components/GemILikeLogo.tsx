type Props = {
  size?: number;
  animated?: boolean;
  firstIColor?: string;
  tagline?: string;
  className?: string;
  gradientClassName?: string;
};

export default function GemILikeLogo({
  size = 96,
  animated = false,
  firstIColor = "#FF7B7B",
  tagline,
  className,
  gradientClassName = "bg-gem-gradient",
}: Props) {
  const gradientClass = [
    gradientClassName,
    "bg-clip-text text-transparent",
    animated ? "animate-gem-shift bg-[length:300%_300%]" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className ?? ""}`} role="img" aria-label="GemILike Logo">
      <div
        className="font-black tracking-[0.02em] drop-shadow-[0_4px_18px_rgba(0,188,212,0.25)]"
        style={{ fontSize: `${size}px`, lineHeight: 1 }}
      >
        <span className={gradientClass}>Gem</span>
        <span className="align-baseline" style={{ color: firstIColor }}>I</span>
        <span className={gradientClass}>Like</span>
      </div>
      {tagline && (
        <div
          className="text-gem-light/90 font-semibold tracking-[0.12em] uppercase"
          style={{ fontSize: Math.max(12, Math.round(size * 0.18)) }}
        >
          {tagline}
        </div>
      )}
    </div>
  );
}
