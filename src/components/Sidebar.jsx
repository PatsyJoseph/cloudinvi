import { Icon } from "./Icons.jsx";
import { QUICK_ACCESS, LOCATIONS } from "../data/fileSystem.js";

function Item({ item, active, onNavigate }) {
  return (
    <button
      className={`side-item ${active ? "active" : ""}`}
      aria-current={active ? "page" : undefined}
      onClick={() => onNavigate(item.id)}
    >
      <Icon name={item.icon} size={17} />
      <span>{item.label}</span>
    </button>
  );
}

export default function Sidebar({ currentId, onNavigate }) {
  return (
    <nav className="sidebar" aria-label="Places">
      <p className="side-title">
        <Icon name="star" size={13} /> Quick access
      </p>
      {QUICK_ACCESS.map((it) => (
        <Item key={it.id} item={it} active={currentId === it.id} onNavigate={onNavigate} />
      ))}
      <p className="side-title">Locations</p>
      {LOCATIONS.map((it) => (
        <Item key={it.id} item={it} active={currentId === it.id} onNavigate={onNavigate} />
      ))}
      <div className="storage" aria-hidden="true">
        <div className="storage-bar"><i style={{ width: "58%" }} /></div>
        <small>214 GB free of 512 GB</small>
      </div>
    </nav>
  );
}
