import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon }          from '@fortawesome/react-fontawesome';
import { faCopy }                   from '@fortawesome/free-regular-svg-icons';

import hljs   from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import bash   from 'highlight.js/lib/languages/bash';
import yaml   from 'highlight.js/lib/languages/yaml';
import json   from 'highlight.js/lib/languages/json';
import plaintext   from 'highlight.js/lib/languages/plaintext';

import 'highlight.js/styles/github-dark.css';   // syntax colours
import './codepanel.css';               // custom layout

// Register languages once
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash',    bash);
hljs.registerLanguage('yaml',    yaml);
hljs.registerLanguage('json',    json);
hljs.registerLanguage('plaintext',    plaintext);

/* --------------------------------------------------------------------- */
export default function CodePanel({
  snippet   = '',
  language  = 'python',
  title     = '',
  className = '',
}) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  /* highlight on mount / update */
  useEffect(() => {
    if (codeRef.current) hljs.highlightElement(codeRef.current);
  }, [snippet]);

  /* copy handler */
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
    });
  };

  return (
    <div className={`code-panel ${className}`}>
      {/* header bar */}
      <header className="code-header">
        <span className="code-title">{title}</span>

        <div className="code-meta">
          <span className="code-lang">{language}</span>

          <button onClick={handleCopy} className="code-copy">
            <FontAwesomeIcon icon={faCopy} className="mr-1" />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </header>

      {/* code body */}
      <pre className="code-body">
        <code ref={codeRef} className={`language-${language}`}>
          {snippet.trimEnd()}
        </code>
      </pre>
    </div>
  );
}
