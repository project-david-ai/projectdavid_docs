// src/components/SideBar/DocsSidebar.jsx

import { useState } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { groupedNavItems, sortedGroupKeys } from '../../lib/docs';
import './DocsSidebar.css';

const categoryDisplayNames = {
  'overview'      : 'OVERVIEW',
  'sdk'           : 'SDK',
  'endpoints'     : 'API ENDPOINTS',
  'providers'     : 'PROVIDERS',
  'infrastructure': 'INFRASTRUCTURE',
  'architecture'  : 'ARCHITECTURE',
};

function SidebarGroup({ groupKey, items, onNavClick, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const label = categoryDisplayNames[groupKey] || groupKey;

  return (
    <div className="sidebar-group">
      <button
        className="sidebar-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{label}</span>
        {open
          ? <ChevronDown size={14} strokeWidth={2} />
          : <ChevronRight size={14} strokeWidth={2} />
        }
      </button>

      {open && (
        <nav>
          {items.map(({ route, label }) => (
            <NavLink
              key={route}
              to={route}
              end
              onClick={onNavClick}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}

export default function DocsSidebar() {
  const [open, setOpen] = useState(false);

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

        {sortedGroupKeys.map(groupKey => (
          <SidebarGroup
            key={groupKey}
            groupKey={groupKey}
            items={groupedNavItems[groupKey]}
            onNavClick={() => setOpen(false)}
            defaultOpen={false}
          />
        ))}
      </aside>

      {/* Backdrop (mobile) */}
      {open && (
        <div className="sidebar-backdrop" onClick={() => setOpen(false)} />
      )}
    </>
  );
}