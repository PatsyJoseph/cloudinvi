import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ left: x, top: y });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPos({
      left: Math.max(8, Math.min(x, window.innerWidth - width - 8)),
      top: Math.max(8, Math.min(y, window.innerHeight - height - 8)),
    });
    el.querySelector("button")?.focus();
  }, [x, y]);

  useEffect(() => {
    const away = (e) => { if (!ref.current?.contains(e.target)) onClose(); };
    const key = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    window.addEventListener("resize", onClose);
    window.addEventListener("blur", onClose);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("blur", onClose);
    };
  }, [onClose]);

  const onKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const btns = [...ref.current.querySelectorAll("button")];
    const i = btns.indexOf(document.activeElement);
    const d = e.key === "ArrowDown" ? 1 : -1;
    btns[(i + d + btns.length) % btns.length]?.focus();
  };

  return (
    <div ref={ref} className="ctx" style={pos} role="menu" onKeyDown={onKeyDown}>
      {items.map((it) => (
        <button
          key={it.label}
          role="menuitem"
          className="ctx-item"
          onClick={() => { onClose(); it.onSelect(); }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
