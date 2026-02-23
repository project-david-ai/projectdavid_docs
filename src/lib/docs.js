/* ──────────────────────────────────────────────────────────────
   src/lib/docs.js
   – collect markdown pages, expose `pages` map + grouped nav list
   – supports explicit slug, nav_order, and optional nav_exclude
   ──────────────────────────────────────────────────────────── */

const categoryDisplayNames = {
  'sdk'           : 'SDK',
  'endpoints'     : 'API ENDPOINTS',
  'infrastructure': 'INFRASTRUCTURE',
  'architecture'  : 'ARCHITECTURE',
};

/* ----------  tiny front-matter parser (keeps bundle slim)  ---------- */
function simpleMatter(raw) {
  const fm = /^---\r?\n([\s\S]+?)\r?\n---\r?\n/;
  const m  = fm.exec(raw);
  if (!m) return { data: {}, content: raw };

  const data = {};
  m[1].split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i > -1) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return { data, content: raw.slice(m[0].length) };
}

/* ----------  1. grab every .md file (eager for build-time)  ---------- */
const mdModules = import.meta.glob('../pages/**/*.md', { as: 'raw', eager: true });

/* ----------  2. build the main { slug: { frontmatter, content } } map  ---------- */
export const pages = Object.entries(mdModules).reduce((acc, [path, raw]) => {
  const { data, content } = simpleMatter(raw);

  const slug = (data.slug || path.split('/').pop().replace('.md', '')).trim();

  acc[slug] = { frontmatter: data, content };
  return acc;
}, {});

/* ----------  3. sidebar / grouped nav items  ------------------------ */
export const groupedNavItems = {};

Object.entries(mdModules).forEach(([path, raw]) => {
  const { data } = simpleMatter(raw);
  if (data.nav_exclude === 'true') return;

  const slug     = (data.slug || path.split('/').pop().replace('.md', '')).trim();
  const parts    = path.split('/');
  const category = data.category || parts[parts.length - 2];

  if (!groupedNavItems[category]) groupedNavItems[category] = [];

  groupedNavItems[category].push({
    slug,
    route    : `/docs/${slug}`,
    nav_order: data.nav_order !== undefined ? Number(data.nav_order) : undefined,
    label    :
      data.title
        ? data.title.replace(/<[^>]+>/g, '')
        : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
  });
});

/* ----------  4. sort each category by nav_order, then alphabetically  ---------- */
Object.values(groupedNavItems).forEach(arr =>
  arr.sort((a, b) => {
    const orderA = a.nav_order !== undefined ? a.nav_order : 999;
    const orderB = b.nav_order !== undefined ? b.nav_order : 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.label.localeCompare(b.label);
  })
);