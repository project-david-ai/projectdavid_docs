// src/pages/DocPage.jsx

import { useParams } from 'react-router-dom';
import { pages } from '../../lib/docs.js'; // Make sure this path is correct

import MarkdownPage from '../../components/MarkdownPage/MarkdownPage.jsx';
import ApiReferencePage from './ApiReferencePage.jsx';

export default function DocPage() {
  // The default value is no longer strictly necessary but doesn't hurt.
  const { slug } = useParams();

  // If slug is undefined (which it shouldn't be for this route), handle it.
  if (!slug) {
    return <div>404 - Invalid Page Route</div>;
  }

  const pageData = pages[slug];

  if (!pageData) {
    return <div>404 - Page Not Found for slug: {slug}</div>;
  }

  if (pageData.frontmatter?.layout === 'api') {
    return <ApiReferencePage pageData={pageData} />;
  }

  return <MarkdownPage content={pageData.content} />;
}