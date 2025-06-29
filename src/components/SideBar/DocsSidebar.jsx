// src/components/SideBar/DocsSidebar.jsx
import { NavLink } from 'react-router-dom';
import { groupedNavItems } from '../../lib/docs';
import './DocsSidebar.css'; // 👈 Import the new stylesheet

// A map to convert folder names to display headers
const categoryDisplayNames = {
  'get-started': 'GET STARTED',
  'core-concepts': 'CORE CONCEPTS',
  'api-guides': 'API GUIDES',
};

export default function DocsSidebar() {
  return (
    <aside className="docs-sidebar">
      {Object.entries(groupedNavItems).map(([groupKey, items]) => (
        <div key={groupKey} className="sidebar-group">
          {/* Render the group header */}
          <h2 className="sidebar-header">
            {categoryDisplayNames[groupKey] || groupKey}
          </h2>

          {/* Render the links within the group */}
          <nav>
            {items.map(({ route, label }) => (
              <NavLink
                key={route}
                to={route}
                end
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
  );
}