import { useCallback, useState } from "react";
import FileManager from "./components/FileManager.jsx";
import MediaPlayer from "./components/MediaPlayer.jsx";
import Invitation from "./components/Invitation.jsx";
import Atmosphere from "./components/Atmosphere.jsx";

/** Fades out right after the reveal so the hand-off from player → invitation is seamless. */
function Veil({ onDone }) {
  return (
    <div className="veil" onAnimationEnd={onDone} aria-hidden="true">
      <Atmosphere active />
    </div>
  );
}

/**
 * stage: "fm" (file manager) → "player" (fake Site Manual.mp4) → "invitation"
 * `primed`: she started the "video" and closed it — next time, go straight to the reveal.
 */
export default function App() {
  const [stage, setStage] = useState("fm");
  const [primed, setPrimed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [fast, setFast] = useState(false);
  const [veil, setVeil] = useState(false);

  const openManual = () => { setFast(primed || revealed); setStage("player"); };
  const closePlayer = useCallback((started) => { if (started) setPrimed(true); setStage("fm"); }, []);
  const reveal = useCallback(() => { setRevealed(true); setVeil(true); setStage("invitation"); }, []);
  const replay = () => { setFast(false); setStage("player"); };

  return (
    <div className="app" data-stage={stage}>
      <FileManager onOpenManual={openManual} inert={stage !== "fm"} />
      {stage === "player" && <MediaPlayer key={String(fast)} fast={fast} onClose={closePlayer} onReveal={reveal} />}
      {stage === "invitation" && <Invitation onBack={() => setStage("fm")} onReplay={replay} />}
      {veil && stage === "invitation" && <Veil onDone={() => setVeil(false)} />}
    </div>
  );
}
