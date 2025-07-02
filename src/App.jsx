// src/App.jsx
import React           from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import DocsLayout from './docsLayout';
import DocPage    from './pages/common/DocPage.jsx';
import DocsHub    from './pages/common/DocsHub.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        {/*  Root → Docs hub  */}
        <Route path="/" element={<Navigate to="/docs" replace />} />

        {/*  /docs hierarchy  ------------------------------------------------ */ }
        <Route path="/docs" element={<DocsLayout />}>
          {/* Hub (cards) */}
          <Route index element={<DocsHub />} />

          {/* ----  DIRECT “nice” routes  ---- */}
          <Route path="entities-api"   element={<DocPage />} />    {/* Entities API / SDK */}
          <Route path="infrastructure" element={<DocPage />} />    {/* Infra docs       */}

          {/* ----  fallback: any other slug  ---- */}
          <Route path=":slug" element={<DocPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
