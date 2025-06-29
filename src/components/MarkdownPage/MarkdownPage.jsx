//  src/components/MarkdownPage.jsx
import ReactMarkdown from 'react-markdown';
import remarkGfm     from 'remark-gfm';

import CodePanel from '..//CodePanel/CodePanel';      // CodePanel lives in the same folder
import './markdown.css';          // global MD styling (max-width, colours)

/* ------------------------------------------------------------------ */
export default function MarkdownPage({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* custom renderer for fenced blocks */
          code({ node, inline, className = '', children, ...props }) {
            const match    = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'plaintext';

            /* inline code  → standard <code> */
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            /* block code   → CodePanel */
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
