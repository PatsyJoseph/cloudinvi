import { useEffect, useState } from "react";
import { Icon } from "./Icons.jsx";
import Atmosphere from "./Atmosphere.jsx";
import { useReducedMotion } from "../lib/hooks.js";
import { eventConfig } from "../config/eventConfig.js";

const DURATION = 227; // "3:47"
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const CAPTIONS = [
  [0, "Welcome to the Site Manual."],
  [3, "Chapter 1 — Navigating your files."],
  [6, "Double-click any folder to open it, and—"],
];

/**
 * Phases: idle → playing → glitch → expanding → title → (onReveal)
 * `fast` skips the fake video and goes straight to the reveal.
 */
export default function MediaPlayer({ fast, onClose, onReveal }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(fast ? "fast" : "idle");
  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);
  const [caption, setCaption] = useState("");
  const [duration, setDuration] = useState(fmt(DURATION));
  const [maxi, setMaxi] = useState(false);

  const full = phase === "expanding" || phase === "title";
  const chromeOff = phase === "glitch" && caption === "This was never a video." || full;

  // fast path
  useEffect(() => {
    if (phase !== "fast") return;
    const id = setTimeout(() => setPhase("expanding"), 80);
    return () => clearTimeout(id);
  }, [phase]);

  // fake playback clock
  useEffect(() => {
    if (phase !== "playing" || paused) return;
    const id = setInterval(() => setT((v) => v + 1), 450);
    return () => clearInterval(id);
  }, [phase, paused]);

  // captions + trigger the glitch
  useEffect(() => {
    if (phase !== "playing") return;
    const c = [...CAPTIONS].reverse().find(([s]) => t >= s);
    if (c) setCaption(c[1]);
    if (t >= 9) setPhase(reduced ? "expanding" : "glitch");
  }, [t, phase, reduced]);

  // the "something is off" beat
  useEffect(() => {
    if (phase !== "glitch") return;
    const ids = [
      setTimeout(() => { setDuration("11:08"); setCaption("…wait."); }, 900),
      setTimeout(() => setCaption("This was never a video."), 2200),
      setTimeout(() => setPhase("expanding"), 4000),
    ];
    return () => ids.forEach(clearTimeout);
  }, [phase]);

  // expand to full viewport, then show the title card
  useEffect(() => {
    if (phase !== "expanding") return;
    const id = setTimeout(() => setPhase("title"), reduced ? 500 : 2200);
    return () => clearTimeout(id);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== "title") return;
    const id = setTimeout(onReveal, reduced ? 2200 : 4600);
    return () => clearTimeout(id);
  }, [phase, reduced, onReveal]);

  const closable = phase === "idle" || phase === "playing" || phase === "glitch";
  useEffect(() => {
    const key = (e) => { if (e.key === "Escape" && closable) onClose(phase !== "idle"); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [closable, phase, onClose]);

  const start = () => { setPhase("playing"); setCaption(CAPTIONS[0][1]); setPaused(false); };
  const togglePlay = () => {
    if (phase === "idle") start();
    else if (phase === "playing") setPaused((p) => !p);
  };
  const skip = () => setPhase("expanding");

  const progress = phase === "idle" || phase === "fast" ? 0 : phase === "playing" ? t / DURATION : 1;
  const canSkip = (phase === "playing" && t >= 2) || phase === "glitch";

  return (
    <div
      className={`player-layer ${full ? "is-full" : ""} phase-${phase} ${chromeOff ? "chrome-off" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site Manual video player"
    >
      <div className="player-backdrop" onClick={() => closable && onClose(phase !== "idle")} />

      <div className={`player-window ${maxi ? "maxi" : ""}`}>
        <div className="player-titlebar">
          <Icon name="play" size={13} />
          <span>Site Manual.mp4 — Media Player</span>
          <button
            className="tb-btn"
            onClick={() => closable && onClose(phase !== "idle")}
            aria-label="Close player"
            disabled={!closable}
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="player-screen">
          <Atmosphere active={full} />
          <div className="vhs-bar" />

          {(phase === "idle" || phase === "fast") && (
            <div className="poster">
              <span className="poster-kicker">Site Manual</span>
              <h2>Getting started</h2>
              <p>{fmt(DURATION)}</p>
              <button className="big-play" onClick={start} aria-label="Play video" autoFocus>
                <Icon name="play" size={30} />
              </button>
            </div>
          )}

          {caption && !full && <p className="caption" key={caption} aria-live="polite">{caption}</p>}

          {phase === "title" && (
            <div className="reveal-title">
              <p className="rt-small">Hi, {eventConfig.recipientName}</p>
              <h2>You&rsquo;re invited.</h2>
            </div>
          )}

          {canSkip && !full && (
            <button className="skip-btn" onClick={skip}>Skip</button>
          )}
        </div>

        <div className="player-controls">
          <button
            className="tb-btn"
            onClick={togglePlay}
            aria-label={phase === "playing" && !paused ? "Pause" : "Play"}
            disabled={phase === "glitch" || full}
          >
            <Icon name={phase === "playing" && !paused ? "pause" : "play"} size={16} />
          </button>
          <span className="time">{fmt(Math.min(t, DURATION))} / {duration}</span>
          <div
            className="pbar"
            role="progressbar"
            aria-label="Playback progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <i style={{ width: `${progress * 100}%` }} />
          </div>
          <Icon name="volume" size={17} className="muted-icon" />
          <button className="tb-btn" onClick={() => setMaxi((m) => !m)} aria-label="Toggle larger window" aria-pressed={maxi}>
            <Icon name="fullscreen" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
