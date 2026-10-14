import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons.jsx";
import Atmosphere from "./Atmosphere.jsx";
import BandShowcase from "./BandShowcase.jsx";
import EventDetails from "./EventDetails.jsx";
import PracticalNote from "./PracticalNote.jsx";
import ResponseCard from "./ResponseCard.jsx";
import { eventConfig } from "../config/eventConfig.js";
import { missingConfig } from "../lib/template.jsx";

/** The concert poster. Tap/click to view it larger. Falls back to a labelled placeholder. */
function Poster() {
  const { poster, posterAlt } = eventConfig;
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const hasImage = poster && !failed;

  useEffect(() => {
    if (!open) return;
    const key = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);

  return (
    <>
      <figure className="poster-frame rise" style={{ "--d": ".7s" }}>
        {hasImage ? (
          <button className="poster-btn" onClick={() => setOpen(true)} aria-label="View the poster larger">
            <img src={poster} alt={posterAlt} onError={() => setFailed(true)} />
          </button>
        ) : (
          <div className="poster-ph">
            <span>[Concert poster TBD]</span>
            <small>{poster ? "Poster image couldn't be loaded." : "Add the image to /public and set `poster` in eventConfig.js"}</small>
          </div>
        )}
      </figure>

      {open && hasImage && (
        <div className="modal-layer lightbox" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Concert poster">
          <img src={poster} alt={posterAlt} />
          <button className="tb-btn lightbox-close" onClick={() => setOpen(false)} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
      )}
    </>
  );
}

export default function Invitation({ onBack, onReplay }) {
  const bandShowcaseRef = useRef(null);
  const c = eventConfig;
  const d = new Date(`${c.dateISO}T00:00:00`);
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  const year = c.dateISO.slice(0, 4);

  useEffect(() => {
    const prev = document.title;
    document.title = `${c.eventName} — ${c.dateLabel}`;
    return () => { document.title = prev; };
  }, [c.eventName, c.dateLabel]);

  const go = (id) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const missing = import.meta.env.DEV ? missingConfig() : [];

  return (
    <div className="invite">
      <Atmosphere fixed />

      <nav className="invite-nav" aria-label="Invitation sections">
        <button className="nav-back" onClick={onBack}>
          <Icon name="back" size={15} /> Files
        </button>
        <div className="nav-links">
          <button onClick={() => go("lineup")}>Bands</button>
          <button onClick={() => go("details")}>Details</button>
          <button onClick={() => go("note")}>A note</button>
          <button onClick={() => go("reply")}>Reply</button>
        </div>
      </nav>

      <div className="invite-content">
        <header className="hero">
          <div className="hero-copy">
            <p className="eyebrow rise" style={{ "--d": ".2s" }}>
              {c.companyName ? `${c.companyName} · ` : ""}{c.eventName}
            </p>
            <h1 className="rise" style={{ "--d": ".45s" }}>
              You&rsquo;re invited,
              <br />
              <em>{c.recipientName}</em>
            </h1>
            <div className="date-badge rise" style={{ "--d": ".8s" }}>
              <span>{weekday}</span>
              <strong>{month} {day}</strong>
              <span>{year}</span>
            </div>
            <p className="hero-note rise" style={{ "--d": "1.1s" }}>{c.personalNote}</p>
          </div>

          <Poster />

          <div className="hero-cue rise" style={{ "--d": "1.5s" }}>
            <span>Meet the bands</span>
            <button className="scroll-cue" onClick={() => go("lineup")} aria-label="Meet the bands">
              <Icon name="down" size={20} />
            </button>
          </div>
        </header>

        <BandShowcase ref={bandShowcaseRef} />
        <EventDetails />
        <PracticalNote />
        <ResponseCard />

        <footer className="invite-footer">
          <button className="btn link" onClick={onReplay}>Replay the reveal</button>
          <button className="btn link" onClick={onBack}>Back to the files</button>
        </footer>
      </div>

      {missing.length > 0 && (
        <div className="dev-badge" role="note">
          <strong>Dev only:</strong> {missing.length} placeholder{missing.length > 1 ? "s" : ""} still unset — {missing.join(", ")}
        </div>
      )}
    </div>
  );
}
