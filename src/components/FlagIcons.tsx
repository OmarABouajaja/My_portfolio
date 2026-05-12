const S = "1em";
type P = { className?: string };

export const FlagUS = ({ className }: P) => (
  <svg viewBox="0 0 64 64" width={S} height={S} className={className} aria-hidden="true">
    <defs><clipPath id="fl-us"><circle cx="32" cy="32" r="32" /></clipPath></defs>
    <g clipPath="url(#fl-us)">
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} y={i * 4.923} width="64" height="4.923" fill={i % 2 === 0 ? "#B22234" : "#FFF"} />
      ))}
      <rect width="25.6" height="34.46" fill="#3C3B6E" />
      {[
        [3,3],[8,3],[13,3],[18,3],[23,3],[5.5,7],[10.5,7],[15.5,7],[20.5,7],
        [3,11],[8,11],[13,11],[18,11],[23,11],[5.5,15],[10.5,15],[15.5,15],[20.5,15],
        [3,19],[8,19],[13,19],[18,19],[23,19],[5.5,23],[10.5,23],[15.5,23],[20.5,23],
        [3,27],[8,27],[13,27],[18,27],[23,27],[5.5,31],[10.5,31],[15.5,31],[20.5,31],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#FFF" />
      ))}
    </g>
  </svg>
);

export const FlagES = ({ className }: P) => (
  <svg viewBox="0 0 64 64" width={S} height={S} className={className} aria-hidden="true">
    <defs><clipPath id="fl-es"><circle cx="32" cy="32" r="32" /></clipPath></defs>
    <g clipPath="url(#fl-es)">
      <rect width="64" height="64" fill="#C60B1E" />
      <rect y="16" width="64" height="32" fill="#FFC400" />
    </g>
  </svg>
);

export const FlagFR = ({ className }: P) => (
  <svg viewBox="0 0 64 64" width={S} height={S} className={className} aria-hidden="true">
    <defs><clipPath id="fl-fr"><circle cx="32" cy="32" r="32" /></clipPath></defs>
    <g clipPath="url(#fl-fr)">
      <rect width="21.33" height="64" fill="#002395" />
      <rect x="21.33" width="21.34" height="64" fill="#FFF" />
      <rect x="42.67" width="21.33" height="64" fill="#ED2939" />
    </g>
  </svg>
);

export const FlagTN = ({ className }: P) => (
  <svg viewBox="0 0 64 64" width={S} height={S} className={className} aria-hidden="true">
    <defs><clipPath id="fl-tn"><circle cx="32" cy="32" r="32" /></clipPath></defs>
    <g clipPath="url(#fl-tn)">
      <rect width="64" height="64" fill="#E70013" />
      <circle cx="32" cy="32" r="13" fill="#FFF" />
      {/* Crescent: offset white disk over red disk */}
      <circle cx="35" cy="32" r="9.5" fill="#E70013" />
      <circle cx="32" cy="32" r="9" fill="#FFF" />
      <polygon points="37,32 38.2,35.5 42,35.5 39,37.8 40,41.3 37,39 34,41.3 35,37.8 32,35.5 35.8,35.5" fill="#E70013" />
    </g>
  </svg>
);

export const FLAG_MAP: Record<string, React.FC<P>> = {
  US: FlagUS, ES: FlagES, FR: FlagFR, TN: FlagTN,
};
