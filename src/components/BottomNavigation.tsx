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

interface BottomNavigationProps {
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

const BottomNavigation: React.FC<BottomNavigationProps> = ({ userRole }) => {
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
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 md:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`
                flex flex-col items-center justify-center
                min-h-[48px] px-2 py-1 rounded-lg
                transition-colors duration-200
                ${active 
                  ? 'text-rose-600 bg-rose-50' 
                  : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
                }
              `}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} className="mb-1" aria-hidden="true" />
              <span className="text-xs font-medium leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;