import { eventConfig } from "../config/eventConfig.js";
import { fillTemplate } from "../lib/template.jsx";

export default function PracticalNote() {
  const { title, paragraphs } = eventConfig.practical;
  return (
    <section className="section" id="note" aria-labelledby="note-h">
      <p className="eyebrow">A note from {eventConfig.senderName}</p>
      <h2 id="note-h">{title}</h2>
      <div className="letter">
        {paragraphs.map((p, i) => (
          <p key={i}>{fillTemplate(p)}</p>
        ))}
        <p className="signoff">— {eventConfig.senderName}</p>
      </div>
    </section>
  );
}
