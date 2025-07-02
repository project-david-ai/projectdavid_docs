import ReactMarkdown from 'react-markdown';
import remarkGfm     from 'remark-gfm';
import CodePanel     from '../../components/CodePanel/CodePanel.jsx';
import './ApiReferencePage.css';

export default function ApiReferencePage({ pageData }) {
  const { frontmatter, content } = pageData;

  /* ── 1. Split markdown into TEXT / CODE segments ─────────────────────── */
  const codeRegex   = /^```(\w*)\r?\n([\s\S]*?)\r?\n```/gm;
  const segments    = [];                       // { type: 'text'|'code', data }
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

  /* ── 2. Combine segments into rows: text (left) + optional code (right) ─ */
  const rows = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    if (seg.type === 'text') {
      // Look ahead: if the next segment is code, pair them.
      const next = segments[i + 1];
      if (next && next.type === 'code') {
        rows.push({ text: seg.data, code: next.data });
        i++;                          // Skip the code we just consumed
      } else {
        rows.push({ text: seg.data, code: null });
      }
    } else {
      // Code without preceding text (edge-case) → right column only
      rows.push({ text: null, code: seg.data });
    }
  }

  /* ── 3. Render ───────────────────────────────────────────────────────── */
  let codeCount = 0;                  // for “Example request / Response” labels

  return (
    <>
      <h1 className="api-title">{frontmatter.title ?? 'API Reference'}</h1>

      <div className="api-grid">
        {rows.map((row, idx) => (
          <div className="api-row" key={idx}>
            {/* left */ }
            {row.text ? (
              <div className="api-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {row.text}
                </ReactMarkdown>
              </div>
            ) : (
              <div />                  /* preserves two-column grid */
            )}

            {/* right */ }
            {row.code && (
              <CodePanel
                language={row.code.lang}
                snippet={row.code.body}
                title={codeCount++ === 0 ? 'Example request' : 'Response'}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
