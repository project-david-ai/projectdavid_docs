// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DocsLayout from './docsLayout';
import DocPage from './pages/DocPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* CHANGED: Redirect the site root "/" directly to the quick-start page. */}
        <Route path="/" element={<Navigate to="/docs/quick-start" replace />} />

        <Route path="/docs" element={<DocsLayout />}>
          {/* CHANGED: If a user lands on "/docs", redirect them to quick-start. */}
          <Route index element={<Navigate to="/docs/quick-start" replace />} />

          {/* This dynamic route remains the same and handles all pages. */}
          <Route path=":slug" element={<DocPage />} />
        </Route>
      </Routes>
    </Router>
  );
}