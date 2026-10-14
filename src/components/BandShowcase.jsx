import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Icon } from "./Icons.jsx";
import { eventConfig } from "../config/eventConfig.js";

const PLACEHOLDERS = [1, 2, 3].map((n) => ({
  id: `placeholder-${n}`,
  name: `[Band ${n}]`,
  role: "Role TBD",
  blurb: "Add this band's name, photo and a line or two in src/config/eventConfig.js.",
}));

const initials = (name) =>
  name.replace(/[\[\]]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function Art({ band, photo }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [band.id, photo]);
  if (photo && !failed) {
    return <img key={photo} className="art-img" src={photo} alt={band.name} loading="lazy" onError={() => setFailed(true)} />;
  }
  return (
    <div className="art-fallback">
      <span>{initials(band.name) || "?"}</span>
      <small>{photo ? "Photo unavailable" : "Photo not added yet"}</small>
    </div>
  );
}

const pad = (n) => String(n).padStart(2, "0");

/** Full-screen, swipeable slideshow that introduces each band one at a time. */
const BandShowcase = forwardRef(function BandShowcase(_props, ref) {
  const bands = eventConfig.performers.length ? eventConfig.performers : PLACEHOLDERS;
  const total = bands.length;
  const [index, setIndex] = useState(0); // 0 = intro, 1..total = bands
  const [dir, setDir] = useState("next");
  const [inView, setInView] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [fadeCycle, setFadeCycle] = useState(0);
  const [musicError, setMusicError] = useState("");
  const rootRef = useRef(null);
  const audioRef = useRef(null);
  const musicEnabledRef = useRef(false);
  const startX = useRef(null);

  const go = (i) => {
    const n = Math.max(0, Math.min(total, i));
    if (n === index) return;
    setDir(n > index ? "next" : "prev");
    setIndex(n);
  };

  // Cinematic entrance when she scrolls (or taps the down arrow) to this section.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.intersectionRatio > 0.4), { threshold: [0, 0.4, 0.7] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Arrow keys work while the slideshow is on screen.
  useEffect(() => {
    if (!inView) return;
    const key = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  });

  const onPointerDown = (e) => { startX.current = e.clientX; };
  const onPointerUp = (e) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 55) go(dx < 0 ? index + 1 : index - 1);
  };

  const band = index > 0 ? bands[index - 1] : null;
  const photos = band?.photos?.length ? band.photos : band?.photo ? [band.photo] : [];
  const songs = band?.songs ?? [];
  const song = songs[trackIndex] ?? (index === 0 ? bands[0]?.songs?.[0] : null);

  useEffect(() => {
    setPhotoIndex(0);
    if (!band || photos.length < 2 || !inView) return;
    const id = setInterval(() => setPhotoIndex((current) => (current + 1) % photos.length), 5000);
    return () => clearInterval(id);
  }, [band, inView, photos.length]);

  useEffect(() => {
    setTrackIndex(0);
    setMusicError("");
  }, [index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!song) {
      audio.pause();
      setMusicPlaying(false);
    } else if (musicEnabledRef.current) {
      playAudio(audio);
    }
  }, [song?.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!musicPlaying || !audio) return;
    audio.volume = 0;
    const id = setInterval(() => {
      audio.volume = Math.min(1, audio.volume + 0.08);
      if (audio.volume >= 1) clearInterval(id);
    }, 120);
    return () => clearInterval(id);
  }, [musicPlaying, trackIndex, fadeCycle]);

  const playAudio = (audio) => {
    audio.volume = 0;
    audio.play().then(() => {
      setMusicPlaying(true);
      setFadeCycle((current) => current + 1);
    }).catch((error) => {
      musicEnabledRef.current = false;
      setMusicPlaying(false);
      setMusicError("Music couldn't be played. Check the audio file and try again.");
      console.error("Background music playback failed:", error);
    });
  };

  useImperativeHandle(ref, () => ({
    startMusic() {
      const audio = audioRef.current;
      if (!audio || !song) return;
      musicEnabledRef.current = true;
      setMusicError("");
      playAudio(audio);
    },
  }), [song?.src]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setMusicError("");
    if (musicPlaying) {
      musicEnabledRef.current = false;
      audio.pause();
      setMusicPlaying(false);
    } else {
      musicEnabledRef.current = true;
      playAudio(audio);
    }
  };

  const advanceTrack = () => {
    if (songs.length > 1) {
      setTrackIndex((current) => (current + 1) % songs.length);
    } else if (audioRef.current && musicEnabledRef.current) {
      audioRef.current.currentTime = 0;
      playAudio(audioRef.current);
    }
  };

  const next = () => {
    if (index < total) go(index + 1);
    else document.getElementById("details")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={rootRef}
      id="lineup"
      className={`showcase ${inView ? "in-view" : ""}`}
      style={{ "--i": index }}
      aria-roledescription="carousel"
      aria-label="Meet the bands"
    >
      <audio
        ref={audioRef}
        src={song?.src}
        preload="none"
        onEnded={advanceTrack}
        onError={() => {
          if (!song) return;
          musicEnabledRef.current = false;
          setMusicPlaying(false);
          setMusicError("This audio file couldn't be loaded. Check its path and format.");
          console.error(`Background music failed to load: ${song.src}`);
        }}
      />
      <div className="stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (startX.current = null)}>
        <div className="stage-glow" aria-hidden="true" />

        <div
          key={index}
          className={`slide dir-${dir} ${band ? (index % 2 === 0 ? "flip" : "") : "slide-intro"}`}
          role="group"
          aria-roledescription="slide"
          aria-label={band ? `${index} of ${total}: ${band.name}` : "Introduction"}
          aria-live="polite"
        >
          {!band ? (
            <>
              <p className="eyebrow">On stage · {eventConfig.dateLabel}</p>
              <h2>Meet the bands</h2>
              <p className="intro-sub">
                {total} {total === 1 ? "act" : "acts"} on the night. Tap through, swipe, or use the arrow keys.
              </p>
              <button className="btn" onClick={() => { if (song) ref?.current?.startMusic(); go(1); }}>
                Start <Icon name="forward" size={16} />
              </button>
            </>
          ) : (
            <>
              <div className="slide-art">
                <Art band={band} photo={photos[photoIndex]} />
                {photos.length > 1 && (
                  <div className="photo-dots" role="group" aria-label="Choose a band photo">
                    {photos.map((photo, i) => (
                      <button
                        key={`${i}-${photo}`}
                        className={`photo-dot ${photoIndex === i ? "active" : ""}`}
                        onClick={() => setPhotoIndex(i)}
                        aria-label={`Show band photo ${i + 1} of ${photos.length}`}
                        aria-pressed={photoIndex === i}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="slide-text">
                <p className="slide-num">{pad(index)} <span>/ {pad(total)}</span></p>
                <p className="p-role">{band.role}</p>
                <h3>{band.name}</h3>
                <p className="slide-blurb">{band.blurb}</p>
                {song && (
                  <div className="music-player">
                    <button className="music-control" onClick={toggleMusic}>
                      <Icon name={musicPlaying ? "pause" : "play"} size={15} />
                      {musicPlaying ? "Pause music" : "Play music"}
                    </button>
                    <span className="music-title">
                      <span className="music-label">Popular songs</span>
                      {song.title}
                    </span>
                    {musicError && <span className="music-error" role="status">{musicError}</span>}
                  </div>
                )}
                {band.link && (
                  <a className="btn ghost" href={band.link.url} target="_blank" rel="noopener noreferrer">
                    {band.link.label}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="show-controls">
        <button className="round-btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
          <Icon name="back" size={20} />
        </button>

        <div className="thumbs" role="tablist" aria-label="Choose a band">
          {bands.map((b, i) => (
            <button
              key={b.id}
              role="tab"
              aria-selected={index === i + 1}
              aria-label={b.name}
              className={`thumb ${index === i + 1 ? "active" : ""}`}
              onClick={() => go(i + 1)}
            >
              <span className="thumb-n">{pad(i + 1)}</span>
              <span className="thumb-name">{b.name}</span>
            </button>
          ))}
        </div>

        <button className="round-btn primary" onClick={next} aria-label={index < total ? "Next slide" : "Continue to the details"}>
          <Icon name={index < total ? "forward" : "down"} size={20} />
        </button>
      </div>
    </section>
  );
});

export default BandShowcase;
