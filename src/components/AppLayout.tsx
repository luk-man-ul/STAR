import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BottomNavigation from './BottomNavigation';
import DesktopNavigation from './DesktopNavigation';
import StarChatbot from './StarChatbot';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { userRole } = useAuth();
  
  return (
    <div className="min-h-screen bg-rose-50">
      {/* Desktop Navigation - hidden on mobile */}
      <DesktopNavigation userRole={userRole} />
      
      {/* Main content area with responsive padding */}
      <main className="pb-20 md:pb-0 md:max-w-4xl md:mx-auto lg:max-w-6xl">
        <div className="md:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation - hidden on desktop, replaced with top nav */}
      <BottomNavigation userRole={userRole} />
      
      {/* Star Chatbot - globally accessible with responsive positioning, hidden for admin */}
      {userRole !== 'admin' && <StarChatbot testId="app-star-chatbot" />}
    </div>
  );
};

export default AppLayout;