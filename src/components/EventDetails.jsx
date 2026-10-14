import { useState } from "react";
import { Icon } from "./Icons.jsx";
import { Field } from "../lib/template.jsx";
import { eventConfig } from "../config/eventConfig.js";

function weekdayOf(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { weekday: "long" });
}

function downloadIcs() {
  const c = eventConfig;
  const start = c.dateISO.replace(/-/g, "");
  const next = new Date(`${c.dateISO}T00:00:00`);
  next.setDate(next.getDate() + 1);
  const end = next.toISOString().slice(0, 10).replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitation//EN", "BEGIN:VEVENT",
    `UID:${start}-invitation@local`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${c.eventName}`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "year-end-party.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function Value({ id }) {
  const c = eventConfig;
  switch (id) {
    case "when":
      return (<>{weekdayOf(c.dateISO)}, {c.dateLabel}<br /><Field name="startTime" /></>);
    case "where":
      return (<><Field name="venue" /><br /><Field name="address" /></>);
    case "dress":
      return <Field name="dressCode" />;
    case "home":
      return <Field name="transport" />;
    default:
      return null;
  }
}

export default function EventDetails() {
  const [open, setOpen] = useState(null);
  return (
    <section className="section" id="details" aria-labelledby="details-h">
      <p className="eyebrow">The night</p>
      <h2 id="details-h">What to expect</h2>

      <div className="tiles">
        {eventConfig.details.map((d) => {
          const isOpen = open === d.id;
          return (
            <button
              key={d.id}
              className={`tile ${isOpen ? "open" : ""}`}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : d.id)}
            >
              <span className="tile-label">{d.label}</span>
              <span className="tile-value"><Value id={d.id} /></span>
              <span className="tile-note"><span>{d.note}</span></span>
              <Icon name="down" size={16} className="tile-chev" />
            </button>
          );
        })}
      </div>

      <button className="btn ghost" onClick={downloadIcs}>
        <Icon name="calendar" size={16} /> Add the date to my calendar
      </button>
    </section>
  );
}
