import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Phone, 
  User, 
  Calendar, 
  MessageCircle, 
  BarChart3, 
  Users, 
  Settings,
  LucideIcon
} from 'lucide-react';
import { UserRole } from '../types';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  requiresAuth?: boolean;
}

interface DesktopNavigationProps {
  userRole: UserRole;
}

// Navigation configurations for each user role
const navigationConfig: Record<UserRole, NavItem[]> = {
  public: [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      path: '/orders',
      requiresAuth: true,
    },
    {
      id: 'call-us',
      label: 'Call Us',
      icon: Phone,
      path: '/call-us',
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      path: '/account',
    },
  ],
  customer: [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
    },
    {
      id: 'my-orders',
      label: 'My Orders',
      icon: ShoppingBag,
      path: '/my-orders',
    },
    {
      id: 'book',
      label: 'Book',
      icon: Calendar,
      path: '/book',
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      path: '/chat',
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      path: '/account',
    },
  ],
  admin: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/admin/dashboard',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      path: '/admin/orders',
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      path: '/admin/customers',
    },
    {
      id: 'services',
      label: 'Services',
      icon: Settings,
      path: '/admin/services',
    },
  ],
};

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = navigationConfig[userRole];

  const handleNavClick = (item: NavItem) => {
    // Redirect unauthenticated users to login for protected features
    if (item.requiresAuth && userRole === 'public') {
      navigate('/login');
      return;
    }
    
    navigate(item.path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className="hidden md:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-4xl mx-auto lg:max-w-6xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-grey-600">
              Star Stitcher
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg
                    transition-colors duration-200 min-h-[44px]
                    ${active 
                      ? 'text-rose-600 bg-rose-50' 
                      : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
                    }
                  `}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className="font-medium">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavigation;