/** Cinematic backdrop: purple/orange glows, stage beams and drifting bokeh. */
export default function Atmosphere({ active = true, fixed = false }) {
  return (
    <div className={`atmos ${active ? "on" : ""} ${fixed ? "fixed" : ""}`} aria-hidden="true">
      <div className="atmos-glow glow-a" />
      <div className="atmos-glow glow-b" />
      <div className="beam" style={{ "--x": "14%", "--d": "0s" }} />
      <div className="beam" style={{ "--x": "50%", "--d": "-3s" }} />
      <div className="beam" style={{ "--x": "86%", "--d": "-6s" }} />
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="bokeh"
          style={{
            left: `${(i * 53 + 11) % 100}%`,
            top: `${(i * 29 + 7) % 100}%`,
            width: `${8 + ((i * 13) % 26)}px`,
            height: `${8 + ((i * 13) % 26)}px`,
            animationDelay: `${(i % 7) * -1.3}s`,
          }}
        />
      ))}
    </div>
  );
}
