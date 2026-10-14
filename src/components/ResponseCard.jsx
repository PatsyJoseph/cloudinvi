import { useEffect, useState } from "react";
import { Icon } from "./Icons.jsx";
import { eventConfig } from "../config/eventConfig.js";

const STORAGE_KEY = "invitation.answer";

// localStorage is only a per-browser convenience; always wrapped in try/catch.
const readSaved = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
const writeSaved = (v) => { try { v ? localStorage.setItem(STORAGE_KEY, v) : localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } };

export default function ResponseCard() {
  const { question, reply, senderName, eventName, dateLabel } = eventConfig;
  const [choice, setChoice] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const saved = readSaved();
    if (saved && question.options.some((o) => o.id === saved)) setChoice(saved);
  }, [question.options]);

  const picked = question.options.find((o) => o.id === choice);
  const message = picked
    ? `Hi ${senderName} — about the ${eventName} on ${dateLabel}: ${picked.label}.`
    : "";

  const choose = (id) => { setChoice(id); writeSaved(id); setCopied(null); };
  const change = () => { setChoice(null); writeSaved(null); setCopied(null); };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  };

  const subject = encodeURIComponent(`Re: ${eventName} — ${dateLabel}`);
  const body = encodeURIComponent(message);
  const sep = /iPhone|iPad|iPod/.test(navigator.userAgent) ? "&" : "?";

  return (
    <section className="section" id="reply" aria-labelledby="reply-h">
      <p className="eyebrow">Your answer</p>
      <h2 id="reply-h">{question.title}</h2>
      <p className="lead">{question.subtitle}</p>

      {!picked ? (
        <div className="options" role="group" aria-label="Answer options">
          {question.options.map((o) => (
            <button key={o.id} className="option" onClick={() => choose(o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <div className={`reply-card ${picked.id === "yes" ? "celebrate" : ""}`} aria-live="polite">
          <p className="reply-chosen">You chose: <strong>{picked.label}</strong></p>
          <p className="reply-text">{picked.reply}</p>

          <div className="reply-actions">
            {reply.email && (
              <a className="btn" href={`mailto:${reply.email}?subject=${subject}&body=${body}`}>
                <Icon name="mail" size={16} /> Email my answer
              </a>
            )}
            {reply.phone && (
              <a className="btn" href={`sms:${reply.phone}${sep}body=${body}`}>
                <Icon name="message" size={16} /> Text my answer
              </a>
            )}
            <button className="btn ghost" onClick={copy}>
              <Icon name="copy" size={16} /> Copy my answer
            </button>
            <button className="btn link" onClick={change}>Change my answer</button>
          </div>

          <p className="reply-hint" role="status">
            {copied === "ok" && "Copied — paste it wherever you'd like to tell me."}
            {copied === "fail" && "Couldn't copy automatically. You can select this: " + message}
            {!copied && "Nothing is sent automatically — it's only sent if you choose to."}
          </p>
        </div>
      )}
    </section>
  );
}
