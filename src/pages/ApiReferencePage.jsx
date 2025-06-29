// src/pages/ApiReferencePage.jsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodePanel from '../components/CodePanel/CodePanel';
import './ApiReferencePage.css';

export default function ApiReferencePage({ pageData }) {
  const { frontmatter, content } = pageData;

  // A robust regex to find all code blocks, with capture groups for language and code.
  // It handles both Windows (\r\n) and Unix (\n) line endings.
  const codeBlockRegex = /^```(\w*)\r?\n([\s\S]*?)\r?\n```/gm;

  const codeSnippets = [];
  const textParts = [];
  let lastIndex = 0;
  let match;

  // Use a `for...of` loop with `matchAll` to reliably find every code block.
  for (match of content.matchAll(codeBlockRegex)) {
    // 1. Capture the text content that comes *before* this code block.
    const textBefore = content.slice(lastIndex, match.index);
    if (textBefore) {
      textParts.push(textBefore);
    }

    // 2. Extract the language and code from the capture groups of the match.
    const [fullMatch, lang, code] = match;
    codeSnippets.push({ lang: lang || 'plaintext', code: code.trim() });

    // 3. Update our position in the string to be at the end of this code block.
    lastIndex = match.index + fullMatch.length;
  }

  // 4. Capture any remaining text that comes *after* the last code block.
  const textAfter = content.slice(lastIndex);
  if (textAfter) {
    textParts.push(textAfter);
  }

  // 5. Join all the non-code parts together for the left column.
  const mainContent = textParts.join('');

  return (
    <div className="api-layout">
      {/* Left Column: Renders only the text content */}
      <div className="api-main-content">
        <h1>{frontmatter.title || 'API Reference'}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {mainContent}
        </ReactMarkdown>
      </div>

      {/* Right Column: Renders only the extracted code snippets */}
      <div className="api-side-content">
        {codeSnippets.map((snippet, index) => (
          <CodePanel
            key={index}
            language={snippet.lang}
            snippet={snippet.code}
            title={index === 0 ? 'Example request' : 'Response'}
          />
        ))}
      </div>
    </div>
  );
}