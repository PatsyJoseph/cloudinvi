import { Icon } from "./Icons.jsx";
import { getTrail } from "../data/fileSystem.js";

export default function Toolbar({
  currentId, canBack, canForward, canUp,
  onBack, onForward, onUp, onNavigate,
  query, onQuery, searchLabel, view, onView,
}) {
  const trail = getTrail(currentId);
  return (
    <div className="fm-toolbar" role="toolbar" aria-label="Navigation">
      <div className="tb-group">
        <button className="tb-btn" onClick={onBack} disabled={!canBack} aria-label="Back" title="Back">
          <Icon name="back" />
        </button>
        <button className="tb-btn" onClick={onForward} disabled={!canForward} aria-label="Forward" title="Forward">
          <Icon name="forward" />
        </button>
        <button className="tb-btn" onClick={onUp} disabled={!canUp} aria-label="Up one level" title="Up">
          <Icon name="up" />
        </button>
      </div>

      <nav className="crumbs" aria-label="Breadcrumb">
        {trail.map((n, i) => {
          const last = i === trail.length - 1;
          return (
            <span className="crumb-wrap" key={n.id}>
              {i > 0 && <Icon name="chevron" size={13} className="crumb-sep" />}
              <button
                className={`crumb ${last ? "current" : ""}`}
                aria-current={last ? "page" : undefined}
                onClick={() => onNavigate(n.id)}
              >
                {n.name}
              </button>
            </span>
          );
        })}
      </nav>

      <label className="search">
        <Icon name="search" size={15} />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={searchLabel}
          aria-label={searchLabel}
        />
      </label>

      <div className="tb-group view-toggle" role="group" aria-label="View">
        <button className="tb-btn" aria-pressed={view === "grid"} onClick={() => onView("grid")} aria-label="Grid view" title="Grid view">
          <Icon name="grid" />
        </button>
        <button className="tb-btn" aria-pressed={view === "list"} onClick={() => onView("list")} aria-label="List view" title="List view">
          <Icon name="list" />
        </button>
      </div>
    </div>
  );
}
