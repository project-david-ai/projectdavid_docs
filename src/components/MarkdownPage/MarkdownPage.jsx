import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

import CodePanel from '../CodePanel/CodePanel';
import './markdown.css';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
});

function MermaidBlock({ chart }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.render('mermaid-' + Math.random().toString(36).slice(2), chart)
        .then(({ svg }) => {
          ref.current.innerHTML = svg;
        });
    }
  }, [chart]);

  return <div className="mermaid" ref={ref} />;
}

export default function MarkdownPage({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className = '', children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'plaintext';

            if (inline) {
              return <code className={className} {...props}>{children}</code>;
            }

            // Intercept mermaid blocks
            if (language === 'mermaid') {
              return <MermaidBlock chart={String(children).replace(/\n$/, '')} />;
            }

            return (
              <CodePanel
                snippet={String(children).replace(/\n$/, '')}
                language={language}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}