const PATHS = {
  back: <path d="M15 18l-6-6 6-6" />,
  forward: <path d="M9 18l6-6-6-6" />,
  up: <path d="M12 19V5M5 12l7-7 7 7" />,
  chevron: <path d="M9 18l6-6-6-6" />,
  search: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
  grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  play: <path d="M7 4l13 8-13 8z" fill="currentColor" />,
  pause: <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" />,
  volume: <path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14" />,
  fullscreen: <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />,
  star: <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
  desktop: (<><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>),
  docs: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h8" />,
  download: <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  pictures: (<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></>),
  code: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  disk: <path d="M22 12H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11zM6 16h.01M10 16h.01" />,
  refresh: <path d="M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0114.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0020.5 15" />,
  info: (<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  copy: (<><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></>),
  mail: (<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></>),
  message: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  down: <path d="M12 5v14M19 12l-7 7-7-7" />,
};

export function Icon({ name, size = 18, className = "", strokeWidth = 1.8 }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

const KIND_COLOR = {
  video: "#ff8a3d", text: "#9ca3af", md: "#7aa7ff", pdf: "#f87171",
  image: "#34d399", code: "#a78bfa", zip: "#fbbf24",
};

export function FileIcon({ kind, name = "", size = 56 }) {
  if (kind === "folder") {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        <path d="M6 14a4 4 0 014-4h14l6 7h24a4 4 0 014 4v31a4 4 0 01-4 4H10a4 4 0 01-4-4z" fill="#4a2f8f" />
        <path d="M6 24a4 4 0 014-4h44a4 4 0 014 4v27a4 4 0 01-4 4H10a4 4 0 01-4-4z" fill="#7c52d6" />
        <path d="M6 24a4 4 0 014-4h44a4 4 0 014 4v2H6z" fill="#9a74ee" opacity=".55" />
      </svg>
    );
  }
  const color = KIND_COLOR[kind] ?? "#9ca3af";
  const ext = (name.split(".").pop() || "").toUpperCase().slice(0, 4);
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <path d="M14 6h26l14 14v34a4 4 0 01-4 4H14a4 4 0 01-4-4V10a4 4 0 014-4z" fill="#2b2540" stroke="rgba(255,255,255,.16)" />
      <path d="M40 6v14h14" fill="#3a3254" />
      {kind === "video" && <path d="M26 18v14l12-7z" fill={color} />}
      {kind === "image" && (<><circle cx="24" cy="20" r="3" fill={color} /><path d="M16 34l9-9 6 6 4-4 7 7z" fill={color} opacity=".75" /></>)}
      {kind !== "video" && kind !== "image" && (
        <g fill="rgba(255,255,255,.22)">
          <rect x="17" y="18" width="24" height="3" rx="1.5" />
          <rect x="17" y="25" width="20" height="3" rx="1.5" />
          <rect x="17" y="32" width="14" height="3" rx="1.5" />
        </g>
      )}
      <rect x="14" y="40" width="36" height="13" rx="3" fill={color} />
      <text x="32" y="50" textAnchor="middle" fontSize="9" fontWeight="700" fill="#17121f" fontFamily="system-ui, sans-serif">
        {ext}
      </text>
    </svg>
  );
}
