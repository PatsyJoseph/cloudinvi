import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons.jsx";
import { eventConfig } from "../config/eventConfig.js";

/** The concert poster: tap to view full size. Hidden if unset or the image fails to load. */
export default function Poster() {
  const { poster, posterAlt } = eventConfig;
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const key = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);

  if (!poster || failed) return null;

  return (
    <section className="section poster-section" id="poster" aria-label="Concert poster">
      <button className="poster-frame" onClick={() => setOpen(true)} aria-label="View the poster full size">
        <img src={poster} alt={posterAlt} onError={() => setFailed(true)} />
        <span className="poster-hint">Tap to enlarge</span>
      </button>

      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Poster" onClick={() => setOpen(false)}>
          <button ref={closeRef} className="tb-btn lightbox-close" onClick={() => setOpen(false)} aria-label="Close poster">
            <Icon name="close" />
          </button>
          <img src={poster} alt={posterAlt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
