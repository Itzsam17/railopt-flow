import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemoTourOverlay } from '../demo/DemoTourOverlay';

export const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-rail-dark">
      {/* Responsive Sidebar (Desktop persistent + Mobile slide-over drawer) */}
      <Sidebar 
        mobileOpen={mobileMenuOpen} 
        onCloseMobile={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />
        
        {/* Dynamic Screen Views */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-[1720px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Demo Tour Presenter Overlay */}
      <DemoTourOverlay />
    </div>
  );
};
