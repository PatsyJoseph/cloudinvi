import { useEffect, useRef } from "react";
import { FileIcon, Icon } from "./Icons.jsx";
import { formatDate, kindLabel } from "../data/fileSystem.js";

export default function PreviewModal({ mode, item, location, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const key = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose]);

  const rows = [
    ["Type", kindLabel(item.kind)],
    ["Location", location],
    ...(item.size ? [["Size", item.size]] : []),
    ["Modified", formatDate(item.modified)],
    ...Object.entries(item.meta ?? {}),
  ];

  return (
    <div className="modal-layer" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={item.name}>
        <header className="modal-head">
          <FileIcon kind={item.kind} name={item.name} size={28} />
          <h2>{item.name}{mode === "properties" ? " — Properties" : ""}</h2>
          <button ref={closeRef} className="tb-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>

        {mode === "preview" && item.content ? (
          <pre className="modal-body preview-text">{item.content}</pre>
        ) : mode === "preview" ? (
          <div className="modal-body no-preview">
            <FileIcon kind={item.kind} name={item.name} size={72} />
            <p>No preview available for this file type.</p>
          </div>
        ) : null}

        {mode === "properties" && (
          <dl className="modal-body props">
            {rows.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
