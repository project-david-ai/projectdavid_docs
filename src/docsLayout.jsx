// src/docsLayout.jsx
import { Outlet } from 'react-router-dom';
import DocsSidebar from './components/SideBar/DocsSidebar';

export default function DocsLayout() {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar />
      {/* Add the min-w-0 class here */}
      <main className="flex-1 p-8 bg-white min-w-0">
        <Outlet />
      </main>
    </div>
  );
}