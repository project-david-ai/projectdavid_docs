// src/pages/common/OpenApiReferencePage.jsx

import { useEffect, useState } from 'react';
import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';
import './ApiReferencePage.css';

const OPENAPI_URL = import.meta.env.VITE_OPENAPI_URL || 'http://localhost:9000/openapi.json';

export default function OpenApiReferencePage() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(OPENAPI_URL)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(() => setReady(true))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="api-reference-error">
        <p>Could not load API spec from <code>{OPENAPI_URL}</code></p>
        <p>{error}</p>
      </div>
    );
  }

  if (!ready) {
    return <div className="api-reference-loading">Loading API reference...</div>;
  }

  return (
    <div className="api-reference-wrap">
      <API
        apiDescriptionUrl={OPENAPI_URL}
        router="hash"
        layout="sidebar"
        hideInternal={true}
      />
    </div>
  );
}