import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Toolbar from "./Toolbar.jsx";
import FileView from "./FileView.jsx";
import ContextMenu from "./ContextMenu.jsx";
import PreviewModal from "./PreviewModal.jsx";
import {
  getNode, getParent, sortChildren, trailPath, kindLabel,
} from "../data/fileSystem.js";

export default function FileManager({ onOpenManual, inert }) {
  const [hist, setHist] = useState({ stack: ["desktop"], index: 0 });
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [selectedId, setSelectedId] = useState(null);
  const [openingId, setOpeningId] = useState(null);
  const [menu, setMenu] = useState(null);
  const [modal, setModal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const openTimer = useRef(null);

  const currentId = hist.stack[hist.index];
  const current = getNode(currentId);
  const parentId = getParent(currentId);

  const nav = useCallback((id) => {
    setHist((h) => {
      if (h.stack[h.index] === id) return h;
      const stack = [...h.stack.slice(0, h.index + 1), id];
      return { stack, index: stack.length - 1 };
    });
    setSelectedId(null);
    setQuery("");
  }, []);

  const back = () => { setHist((h) => ({ ...h, index: Math.max(0, h.index - 1) })); setSelectedId(null); setQuery(""); };
  const forward = () => { setHist((h) => ({ ...h, index: Math.min(h.stack.length - 1, h.index + 1) })); setSelectedId(null); setQuery(""); };
  const up = () => { if (parentId) nav(parentId); };

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = sortChildren(current.children ?? []);
    return q ? list.filter((n) => n.name.toLowerCase().includes(q)) : list;
  }, [current, query]);

  const selected = items.find((i) => i.id === selectedId);

  const openItem = (item) => {
    if (item.type === "folder") { nav(item.id); return; }
    setOpeningId(item.id);
    clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => {
      setOpeningId(null);
      if (item.special === "manual") onOpenManual();
      else setModal({ mode: "preview", item });
    }, item.special === "manual" ? 450 : 220);
  };
  useEffect(() => () => clearTimeout(openTimer.current), []);

  // Global shortcuts: Backspace / Alt+arrows
  useEffect(() => {
    if (inert) return;
    const onKey = (e) => {
      if (modal || menu) return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Backspace") { e.preventDefault(); up(); }
      if (e.altKey && e.key === "ArrowLeft") { e.preventDefault(); back(); }
      if (e.altKey && e.key === "ArrowRight") { e.preventDefault(); forward(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const menuItems = !menu ? [] : menu.item
    ? [
        { label: "Open", onSelect: () => openItem(menu.item) },
        { label: "Properties", onSelect: () => setModal({ mode: "properties", item: menu.item }) },
        { label: "Copy name", onSelect: () => navigator.clipboard?.writeText(menu.item.name).catch(() => {}) },
      ]
    : [
        { label: view === "grid" ? "View as list" : "View as grid", onSelect: () => setView((v) => (v === "grid" ? "list" : "grid")) },
        { label: "Refresh", onSelect: () => setRefreshKey((k) => k + 1) },
        { label: "Properties", onSelect: () => setModal({ mode: "properties", item: current }) },
      ];

  const closeMenu = useCallback(() => setMenu(null), []);
  const closeModal = useCallback(() => setModal(null), []);

  const opening = openingId && items.find((i) => i.id === openingId);

  return (
    <div className="fm" aria-hidden={inert || undefined} {...(inert ? { inert: "" } : {})}>
      <header className="fm-titlebar">
        <span className="app-logo" aria-hidden="true" />
        <strong>Files</strong>
        <span className="fm-sub">portfolio build · v0.4.2</span>
      </header>

      <Toolbar
        currentId={currentId}
        canBack={hist.index > 0}
        canForward={hist.index < hist.stack.length - 1}
        canUp={!!parentId}
        onBack={back}
        onForward={forward}
        onUp={up}
        onNavigate={nav}
        query={query}
        onQuery={setQuery}
        searchLabel={`Search ${current.name}`}
        view={view}
        onView={setView}
      />

      <div className="fm-body">
        <Sidebar currentId={currentId} onNavigate={nav} />
        <main className="fm-main">
          <div className="fm-content" key={`${currentId}-${refreshKey}`}>
            <FileView
              items={items}
              view={view}
              selectedId={selectedId}
              openingId={openingId}
              onSelect={setSelectedId}
              onOpen={openItem}
              onContext={setMenu}
              emptyText={query ? `No results for “${query}”` : "This folder is empty"}
            />
          </div>
        </main>
      </div>

      <footer className="fm-status" aria-live="polite">
        <span>
          {items.length} {items.length === 1 ? "item" : "items"}
          {selected && ` · 1 selected${selected.size ? ` · ${selected.size}` : ""} · ${kindLabel(selected.kind)}`}
        </span>
        <span>{opening ? `Opening ${opening.name}…` : trailPath(currentId)}</span>
      </footer>

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={closeMenu} />}
      {modal && (
        <PreviewModal
          mode={modal.mode}
          item={modal.item}
          location={trailPath(getParent(modal.item.id) ?? modal.item.id)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
