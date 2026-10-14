// A believable (and entirely static) file tree for the cover story.
// The special node `Site Manual.mp4` has `special: "manual"` — opening it
// launches the interactive player instead of a normal preview.

const file = (id, name, kind, size, modified, extra = {}) => ({
  id, name, kind, size, modified, type: "file", ...extra,
});
const folder = (id, name, modified, children = []) => ({
  id, name, kind: "folder", modified, type: "folder", children,
});

const README = `# Files — portfolio build

A small desktop-style file manager built with React.
Everything you see here is front-end only: no real file system is touched.

## Done
- Sidebar, breadcrumb, back / forward / up
- Grid and list views
- Selection, keyboard navigation, context menu
- Search within the current folder

## Next
- Drag to select
- Rename in place
- Real thumbnails
`;

const CHANGELOG = `v0.4.2
- Fix context menu clipping near the viewport edge
- Smoother folder open transition

v0.4.1
- Keyboard navigation in grid view
- Long-press for context menu on touch screens

v0.4.0
- List view with sortable-looking columns
- Search field
`;

const TODO = `todo
----
[x] context menu
[x] breadcrumb overflow on mobile
[ ] fix scroll jank in list view
[ ] record the walkthrough -> "Site Manual.mp4"
    (make sure people actually watch it before poking around!)
`;

const IDEAS = `ideas
-----
- empty states that feel designed, not forgotten
- a "recent" view
- tiny sound on delete? probably annoying
- animated folder open (done, tweak easing)
`;

const READING = `# Reading list

- Designing interfaces that feel inevitable
- Motion as meaning, not decoration
- Small details in desktop software
`;

export const SPECIAL_MANUAL_ID = "site-manual";

const tree = folder("root", "This PC", "2026-10-01T09:00:00", [
  folder("desktop", "Desktop", "2026-10-12T20:14:00", [
    folder("desktop-notes", "Notes", "2026-10-05T18:30:00", [
      file("ideas", "ideas.txt", "text", "2 KB", "2026-10-05T18:30:00", { content: IDEAS }),
      file("reading", "reading-list.md", "md", "1 KB", "2026-09-30T11:02:00", { content: READING }),
    ]),
    file("todo", "todo.txt", "text", "1 KB", "2026-10-12T20:14:00", { content: TODO }),
    file("shot", "Screenshot 2026-10-02.png", "image", "1.1 MB", "2026-10-02T16:41:00"),
  ]),
  folder("documents", "Documents", "2026-10-09T21:47:00", [
    folder("doc-design", "Design", "2026-09-22T10:15:00", [
      file("brand", "brand-guidelines.pdf", "pdf", "3.4 MB", "2026-09-22T10:15:00"),
      file("mood", "moodboard.png", "image", "5.8 MB", "2026-09-18T13:50:00"),
    ]),
    folder("doc-notes", "Notes", "2026-10-05T18:30:00", [
      file("ideas2", "ideas.txt", "text", "2 KB", "2026-10-05T18:30:00", { content: IDEAS }),
    ]),
    file("readme", "README.md", "md", "2 KB", "2026-10-08T09:20:00", { content: README }),
    file("changelog", "changelog.txt", "text", "1 KB", "2026-10-08T09:25:00", { content: CHANGELOG }),
    file("design-notes", "design-notes.pdf", "pdf", "812 KB", "2026-09-27T15:05:00"),
    file(SPECIAL_MANUAL_ID, "Site Manual.mp4", "video", "48.2 MB", "2026-10-09T21:47:00", {
      special: "manual",
      meta: { Length: "03:47", Dimensions: "1920 × 1080", "Frame rate": "30 fps" },
    }),
  ]),
  folder("downloads", "Downloads", "2026-10-11T08:03:00", [
    file("fonts", "font-pack.zip", "zip", "12.6 MB", "2026-10-11T08:03:00"),
    file("ref", "reference-photo.jpg", "image", "2.3 MB", "2026-10-03T19:22:00"),
    file("icons", "icon-set.zip", "zip", "4.9 MB", "2026-09-29T12:40:00"),
  ]),
  folder("pictures", "Pictures", "2026-10-02T16:41:00", [
    folder("screens", "Screenshots", "2026-10-02T16:41:00", [
      file("s1", "ui-v1.png", "image", "980 KB", "2026-09-14T17:10:00"),
      file("s2", "ui-v2.png", "image", "1.0 MB", "2026-09-28T17:45:00"),
    ]),
    file("wall", "wallpaper.jpg", "image", "4.2 MB", "2026-08-30T22:18:00"),
  ]),
  folder("projects", "Projects", "2026-10-10T23:09:00", [
    folder("p1", "portfolio-v2", "2026-10-10T23:09:00", [
      file("p1a", "package.json", "code", "1 KB", "2026-10-10T23:09:00"),
      file("p1b", "App.jsx", "code", "6 KB", "2026-10-10T22:51:00"),
      file("p1c", "styles.css", "code", "9 KB", "2026-10-10T22:40:00"),
    ]),
    folder("p2", "ui-experiments", "2026-09-26T14:00:00", [
      file("p2a", "glass-card.html", "code", "3 KB", "2026-09-26T14:00:00"),
    ]),
    folder("p3", "component-library", "2026-09-04T10:30:00"),
  ]),
  folder("drive-d", "Portfolio (D:)", "2026-08-15T09:00:00", [
    folder("archive", "Archive", "2026-08-15T09:00:00"),
    file("backup", "backup-2026-08.zip", "zip", "212 MB", "2026-08-15T09:00:00"),
  ]),
]);

const index = {};
const parent = {};
(function walk(node, p) {
  index[node.id] = node;
  parent[node.id] = p;
  node.children?.forEach((c) => walk(c, node.id));
})(tree, null);

export const getNode = (id) => index[id];
export const getParent = (id) => parent[id];

/** Nodes from the root down to `id`. */
export function getTrail(id) {
  const trail = [];
  for (let cur = id; cur; cur = parent[cur]) trail.unshift(index[cur]);
  return trail;
}

export const trailPath = (id) =>
  getTrail(id).map((n) => n.name).join(" › ");

export function sortChildren(list) {
  return [...list].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
  });
}

const KIND_LABEL = {
  folder: "File folder",
  video: "MPEG-4 Video",
  text: "Text Document",
  md: "Markdown Document",
  pdf: "PDF Document",
  image: "Image",
  code: "Source File",
  zip: "Compressed Archive",
};
export const kindLabel = (kind) => KIND_LABEL[kind] ?? "File";

export function formatDate(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export const QUICK_ACCESS = [
  { id: "desktop", label: "Desktop", icon: "desktop" },
  { id: "documents", label: "Documents", icon: "docs" },
  { id: "downloads", label: "Downloads", icon: "download" },
  { id: "pictures", label: "Pictures", icon: "pictures" },
  { id: "projects", label: "Projects", icon: "code" },
];
export const LOCATIONS = [{ id: "drive-d", label: "Portfolio (D:)", icon: "disk" }];
