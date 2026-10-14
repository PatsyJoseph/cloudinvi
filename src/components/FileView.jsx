import { useRef } from "react";
import { FileIcon } from "./Icons.jsx";
import { formatDate, kindLabel } from "../data/fileSystem.js";

export default function FileView({
  items, view, selectedId, openingId, onSelect, onOpen, onContext, emptyText,
}) {
  const refs = useRef({});
  const containerRef = useRef(null);
  const pressTimer = useRef(null);
  const longPressed = useRef(false);

  const focusItem = (id) => requestAnimationFrame(() => refs.current[id]?.focus());

  const columns = () => {
    if (view !== "grid" || !containerRef.current) return 1;
    return getComputedStyle(containerRef.current).gridTemplateColumns.split(" ").length || 1;
  };

  const handleKey = (e) => {
    if (!items.length) return;
    const idx = items.findIndex((i) => i.id === selectedId);
    const cols = columns();
    let next = idx;
    switch (e.key) {
      case "ArrowRight": next = view === "grid" ? idx + 1 : idx; break;
      case "ArrowLeft": next = view === "grid" ? idx - 1 : idx; break;
      case "ArrowDown": next = idx + cols; break;
      case "ArrowUp": next = idx - cols; break;
      case "Home": next = 0; break;
      case "End": next = items.length - 1; break;
      case "Enter":
        if (idx >= 0) { e.preventDefault(); onOpen(items[idx]); }
        return;
      case "ContextMenu":
      case "F10": {
        if (e.key === "F10" && !e.shiftKey) return;
        if (idx < 0) return;
        e.preventDefault();
        const r = refs.current[items[idx].id]?.getBoundingClientRect();
        if (r) onContext({ x: r.left + 24, y: r.bottom - 8, item: items[idx] });
        return;
      }
      default: return;
    }
    e.preventDefault();
    if (idx < 0) next = 0;
    next = Math.max(0, Math.min(items.length - 1, next));
    onSelect(items[next].id);
    focusItem(items[next].id);
  };

  const handleClick = (e, item) => {
    if (longPressed.current) { longPressed.current = false; return; }
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (e.detail >= 2 || (coarse && item.id === selectedId)) onOpen(item);
    else onSelect(item.id);
  };

  const startPress = (e, item) => {
    if (e.pointerType !== "touch") return;
    const { clientX: x, clientY: y } = e;
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      longPressed.current = true;
      onSelect(item.id);
      onContext({ x, y, item });
    }, 550);
  };
  const cancelPress = () => clearTimeout(pressTimer.current);

  const firstTabbable = selectedId ?? items[0]?.id;

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Files and folders"
      className={view === "grid" ? "file-grid" : "file-list"}
      onKeyDown={handleKey}
      onClick={(e) => { if (!e.target.closest(".file-item")) onSelect(null); }}
      onContextMenu={(e) => {
        if (e.target.closest(".file-item")) return;
        e.preventDefault();
        onContext({ x: e.clientX, y: e.clientY, item: null });
      }}
    >
      {view === "list" && (
        <div className="file-list-head" aria-hidden="true">
          <span>Name</span><span>Date modified</span><span>Type</span><span>Size</span>
        </div>
      )}

      {items.length === 0 && <p className="empty">{emptyText}</p>}

      {items.map((item) => (
        <button
          key={item.id}
          ref={(el) => { refs.current[item.id] = el; }}
          role="option"
          aria-selected={item.id === selectedId}
          tabIndex={item.id === firstTabbable ? 0 : -1}
          className={`file-item ${item.id === selectedId ? "selected" : ""} ${item.id === openingId ? "opening" : ""}`}
          title={`${item.name}\n${kindLabel(item.kind)}${item.size ? `\nSize: ${item.size}` : ""}\nModified: ${formatDate(item.modified)}`}
          onClick={(e) => handleClick(e, item)}
          onPointerDown={(e) => startPress(e, item)}
          onPointerUp={cancelPress}
          onPointerLeave={cancelPress}
          onPointerCancel={cancelPress}
          onContextMenu={(e) => {
            e.preventDefault();
            onSelect(item.id);
            onContext({ x: e.clientX, y: e.clientY, item });
          }}
        >
          <span className="fi-icon"><FileIcon kind={item.kind} name={item.name} size={view === "grid" ? 56 : 26} /></span>
          <span className="fi-name">{item.name}</span>
          {view === "list" && (
            <>
              <span className="fi-col">{formatDate(item.modified)}</span>
              <span className="fi-col">{kindLabel(item.kind)}</span>
              <span className="fi-col fi-size">{item.size ?? ""}</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}
