import { Link } from 'react-router-dom';
import logoBW from '../../assets/logo/logo-entities-black-and-white.png'; // ⬅ adjust if your relative path differs
import './DocsHub.css';

// Prefer Vite-style env first, then CRA‑style, then plain process.env, then fallback
const BASE_URL =
  import.meta.env?.VITE_BASE_URL ||
  process.env?.REACT_APP_BASE_URL ||
  process.env?.BASE_URL ||
  'http://localhost:5174';

export default function DocsHub() {
  const cards = [
    {
      href: `${BASE_URL}/docs/api-index`,
      title: 'Entities API + SDK',
      blurb: 'Build with the Entities API REST endpoints and SDKs',
    },
    {
      href: `${BASE_URL}/docs/infra-index`,
      title: 'Infrastructure Guide',
      blurb:
        'Hands-on guide to running the Entities API in your own environment. Fork the repo, ' +
        'explore the architecture, and follow step-by-step instructions for local development, ' +
        'testing, and production deployment',
    },
  ];

  return (
    <section className="docs-hub">
      <h1 className="docs-hub__title">Developer Documentation</h1>

      <div className="docs-hub__grid">
        {cards.map((c) => (
          <Link className="docs-card" to={c.href} key={c.href}>
            {/* Small centred logo */}
            <img src={logoBW} alt="Entities logo" className="docs-card__logo" />

            <h2 className="docs-card__heading">{c.title}</h2>
            <p className="docs-card__blurb">{c.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
