// src/pages/DocPage.jsx
import { useParams } from 'react-router-dom';
import { pages } from '../lib/docs';

// Import our two layout components
import MarkdownPage from '..//components//MarkdownPage/MarkdownPage';
import ApiReferencePage from './ApiReferencePage';

export default function DocPage() {
  const { slug = 'index' } = useParams();
  const pageData = pages[slug];

  if (!pageData) {
    // A more robust check for both missing page and missing frontmatter
    return <div>404 - Page Not Found</div>;
  }

  // Check the frontmatter and render the correct layout component
  if (pageData.frontmatter && pageData.frontmatter.layout === 'api') {
    return <ApiReferencePage pageData={pageData} />;
  }

  // Default to the standard single-column layout
  return <MarkdownPage content={pageData.content} />;
}