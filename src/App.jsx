// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import DocsLayout from './docsLayout';
import DocPage from './pages/common/DocPage.jsx';
import DocsHub from './pages/common/DocsHub.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        {/*  Root → Docs hub  */}
        <Route path="/" element={<Navigate to="/docs" replace />} />

        {/*  /docs hierarchy  ------------------------------------------------ */ }
        <Route path="/docs" element={<DocsLayout />}>
          {/* Hub (cards) - Renders at /docs */}
          <Route index element={<DocsHub />} />

          {/* ---- REMOVED REDUNDANT STATIC ROUTES ---- */}
          {/*
            These routes were causing the issue because they don't pass a "slug"
            parameter to the DocPage component.
          */}
          {/* <Route path="entities-api"   element={<DocPage />} /> */}
          {/* <Route path="infrastructure" element={<DocPage />} /> */}

          {/* ---- CONSOLIDATED DYNAMIC ROUTE ---- */}
          {/*
            This single route now handles all document pages like
            /docs/entities-api and /docs/infrastructure. The "slug" from the URL
            (e.g., "entities-api") is passed to DocPage via the useParams() hook.
          */}
          <Route path=":slug" element={<DocPage />} />
        </Route>
      </Routes>
    </Router>
  );
}