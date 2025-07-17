import ReactMarkdown from 'react-markdown';
import remarkGfm     from 'remark-gfm';
import CodePanel     from '../../components/CodePanel/CodePanel.jsx';
import './ApiReferencePage.css';

export default function ApiReferencePage({ pageData }) {
  const { frontmatter, content } = pageData;

  /* ── 1. Split markdown into TEXT / CODE segments ─────────────────────── */
  const codeRegex = /^```(\w*)\r?\n([\s\S]*?)\r?\n```/gm;
  const segments  = [];                 // { type: 'text' | 'code', data }
  let lastIdx = 0, match;

  for (match of content.matchAll(codeRegex)) {
    const preText = content.slice(lastIdx, match.index);
    if (preText.trim()) segments.push({ type: 'text', data: preText });

    const [, lang = 'plaintext', body] = match;
    segments.push({ type: 'code', data: { lang, body: body.trim() } });

    lastIdx = match.index + match[0].length;
  }
  const tail = content.slice(lastIdx);
  if (tail.trim()) segments.push({ type: 'text', data: tail });

  /* ── 2. Combine segments into rows: text + request + optional response ─ */
  const rows = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    if (seg.type === 'text') {
      const next     = segments[i + 1];
      const nextNext = segments[i + 2];

      if (next?.type === 'code' && nextNext?.type === 'code') {
        rows.push({ text: seg.data, codeBlocks: [next.data, nextNext.data] });
        i += 2;
      } else if (next?.type === 'code') {
        rows.push({ text: seg.data, codeBlocks: [next.data] });
        i += 1;
      } else {
        rows.push({ text: seg.data, codeBlocks: [] });
      }
    } else {
      rows.push({ text: null, codeBlocks: [seg.data] }); // code w/out text
    }
  }

  /* ── 3. Render ───────────────────────────────────────────────────────── */
  let codeCount = 0; // Example request / Response labels

  return (
    <>
      <h1 className="api-title">{frontmatter.title ?? 'API Reference'}</h1>

      <div className="api-grid">
        {rows.map((row, idx) => (
          <div className="api-row" key={idx}>
            {/* Left column */}
            {row.text ? (
              <div className="api-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {row.text}
                </ReactMarkdown>
              </div>
            ) : (
              /* Empty div preserves the two-column grid when no text */
              <div />
            )}

            {/* Right column – stack one or two CodePanels */}
            <div className="code-stack">
              {row.codeBlocks?.map((block, i) => (
                <CodePanel
                  key={i}
                  language={block.lang}
                  snippet={block.body}
                  title={i === 0 ? 'Example request' : 'Response'}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
