import { useState } from 'react';
import { Menu, X }   from 'lucide-react';
import { NavLink }   from 'react-router-dom';
import { groupedNavItems } from '../../lib/docs';
import './DocsSidebar.css';

/* Map folder names → UI section titles */
const categoryDisplayNames = {
  'get-started'  : 'GET STARTED',
  'core-concepts': 'CORE CONCEPTS',
  'api-guides'   : 'API GUIDES',
};

export default function DocsSidebar() {
  const [open, setOpen] = useState(false);      // mobile drawer toggle

  return (
    <>
      {/* ── Burger (mobile only) ─────────────────────────────── */}
      <button
        className="docs-burger"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu size={22} strokeWidth={2} />
      </button>

      {/* ── Sidebar / Drawer ────────────────────────────────── */}
      <aside className={`docs-sidebar ${open ? 'sidebar--open' : ''}`}>
        {/* Close button (mobile) */}
        <button
          className="sidebar-close"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        >
          <X size={22} strokeWidth={2} />
        </button>

        {Object.entries(groupedNavItems).map(([groupKey, items]) => (
          <div key={groupKey} className="sidebar-group">
            <h2 className="sidebar-header">
              {categoryDisplayNames[groupKey] || groupKey}
            </h2>

            <nav>
              {items.map(({ route, label }) => (
                <NavLink
                  key={route}
                  to={route}
                  end
                  onClick={() => setOpen(false)}      /* close drawer on select */
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </aside>

      {/* Backdrop (mobile) */}
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}
