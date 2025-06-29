// src/lib/docs.js

const categoryDisplayNames = {
  'get-started': 'GET STARTED',
  'core-concepts': 'CORE CONCEPTS',
  'api-guides': 'API GUIDES',
};

/**
 * A simple, dependency-free frontmatter parser.
 * Replaces the 'gray-matter' library to avoid browser/Vite compatibility issues.
 * @param {string} rawContent The raw string content of a markdown file.
 * @returns {{data: object, content: string}}
 */
function simpleMatter(rawContent) {
  const frontmatterRegex = /^---\r?\n([\s\S]+?)\r?\n---\r?\n/;
  const match = frontmatterRegex.exec(rawContent);

  if (!match) {
    return { data: {}, content: rawContent };
  }

  const frontmatterBlock = match[1];
  const content = rawContent.slice(match[0].length);
  const data = {};

  frontmatterBlock.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      data[key] = value;
    }
  });

  return { data, content };
}


/* ── 1. Discover all .md files ────────────────────────────────── */
const pageModules = import.meta.glob('../pages/**/*.md', { as: 'raw', eager: true });


/* ── 2. Parse frontmatter and content for each page ───────────── */
export const pages = Object.entries(pageModules).reduce((acc, [path, rawContent]) => {
  const { data, content } = simpleMatter(rawContent); // 👈 Use our custom parser
  const slug = path.split('/').pop().replace('.md', '');
  acc[slug] = { frontmatter: data, content };
  return acc;
}, {});


/* ── 3. Create a grouped list for the sidebar ─────────────────── */
export const groupedNavItems = Object.keys(pageModules).reduce((acc, path) => {
    const pathParts = path.split('/');
    const category = pathParts[pathParts.length - 2];
    const slug = pathParts.pop().replace('.md', '');
    if (!acc[category]) {
      acc[category] = [];
    }
    const navItem = {
      slug,
      route: slug === 'index' ? `/docs/${category}` : `/docs/${slug}`,
      label: (slug === 'index' ? 'Overview' : slug)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    };
    acc[category].push(navItem);
    return acc;
}, {});

// Sort items
Object.values(groupedNavItems).forEach(items => {
    items.sort((a, b) => a.label.localeCompare(b.label));
});