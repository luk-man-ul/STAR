import React, { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type ChatbotAction = 'book-now' | 'price-inquiry' | 'talk-to-tailor';

interface StarChatbotProps {
  onActionSelect?: (action: ChatbotAction) => void;
  testId?: string; // Optional test ID for testing isolation
}

const StarChatbot: React.FC<StarChatbotProps> = ({ onActionSelect, testId = 'star-chatbot' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Ensure modal starts closed on component mount
  useEffect(() => {
    setIsModalOpen(false);
  }, []);

  // Handle focus management for accessibility
  useEffect(() => {
    if (isModalOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the first button in the modal
      const firstButton = modalRef.current?.querySelector('button');
      if (firstButton) {
        firstButton.focus();
      }
      
      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleModalClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isModalOpen]);

  const handleStarClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleActionClick = (action: ChatbotAction) => {
    if (onActionSelect) {
      onActionSelect(action);
    }

    // Handle different actions
    switch (action) {
      case 'book-now':
        navigate('/book');
        setIsModalOpen(false);
        break;
      
      case 'price-inquiry':
        // Show pricing modal or navigate to services
        showPricingInfo();
        break;
      
      case 'talk-to-tailor':
        // Show contact options
        showContactOptions();
        break;
    }
  };

  const showPricingInfo = () => {
    setIsModalOpen(false);
    // Navigate to home page where services are displayed
    navigate('/');
    // Scroll to services section after a brief delay
    setTimeout(() => {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const showContactOptions = () => {
    setIsModalOpen(false);
    setShowContactModal(true);
  };

  const handleContactOptionClick = (method: 'phone' | 'whatsapp' | 'email') => {
    const phoneNumber = import.meta.env.VITE_SHOP_PHONE || '+919876543210';
    const whatsappNumber = import.meta.env.VITE_SHOP_WHATSAPP || '919876543210';
    const email = import.meta.env.VITE_SHOP_EMAIL || 'contact@startailors.com';
    
    switch (method) {
      case 'phone':
        window.location.href = `tel:${phoneNumber}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${whatsappNumber}?text=Hi, I would like to inquire about your tailoring services.`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${email}?subject=Tailoring Inquiry`;
        break;
    }
    
    setShowContactModal(false);
  };

  return (
    <>
      {/* Floating Star Chatbot Button */}
      <button
        onClick={handleStarClick}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        aria-label="Open chat options"
        data-testid={`${testId}-button`}
      >
        <Star className="w-6 h-6 fill-current" aria-hidden="true" />
      </button>

      {/* Bottom Sheet Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={handleModalClose}
            aria-hidden="true"
          />
          
          {/* Modal Content */}
          <div 
            ref={modalRef}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl transform transition-transform duration-300 ease-out"
            data-testid={`${testId}-modal`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-modal-title"
          >
            <div className="p-6">
              {/* Handle bar */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" aria-hidden="true" />
              
              {/* Title */}
              <h3 
                id="chatbot-modal-title"
                className="text-lg font-semibold text-slate-800 text-center mb-6"
              >
                How can we help you?
              </h3>
              
              {/* Action Buttons */}
              <div className="space-y-3" role="group" aria-label="Chat options">
                <button
                  onClick={() => handleActionClick('book-now')}
                  className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  data-testid={`${testId}-book-now`}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      handleModalClose();
                    }
                  }}
                >
                  Book Now
                </button>
                
                <button
                  onClick={() => handleActionClick('price-inquiry')}
                  className="w-full h-12 bg-white border-2 border-rose-600 text-rose-600 hover:bg-rose-50 rounded-full font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  data-testid={`${testId}-price-inquiry`}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      handleModalClose();
                    }
                  }}
                >
                  Price Inquiry
                </button>
                
                <button
                  onClick={() => handleActionClick('talk-to-tailor')}
                  className="w-full h-12 bg-white border-2 border-rose-600 text-rose-600 hover:bg-rose-50 rounded-full font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  data-testid={`${testId}-talk-to-tailor`}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      handleModalClose();
                    }
                  }}
                >
                  Talk to Tailor
                </button>
              </div>
              
              {/* Safe area padding for mobile */}
              <div className="h-6" />
            </div>
          </div>
        </>
      )}

      {/* Contact Options Modal */}
      {showContactModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={() => setShowContactModal(false)}
            aria-hidden="true"
          />
          
          {/* Modal Content */}
          <div 
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl transform transition-transform duration-300 ease-out"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <div className="p-6">
              {/* Handle bar */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" aria-hidden="true" />
              
              {/* Title */}
              <h3 
                id="contact-modal-title"
                className="text-lg font-semibold text-slate-800 text-center mb-2"
              >
                Contact Star Tailors
              </h3>
              <p className="text-sm text-slate-600 text-center mb-6">
                Choose your preferred method to reach us
              </p>
              
              {/* Contact Options */}
              <div className="space-y-3">
                <button
                  onClick={() => handleContactOptionClick('phone')}
                  className="w-full p-4 bg-white border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">Phone Call</div>
                      <div className="text-sm text-slate-600">{import.meta.env.VITE_SHOP_PHONE || '+91 98765 43210'}</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleContactOptionClick('whatsapp')}
                  className="w-full p-4 bg-white border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">WhatsApp</div>
                      <div className="text-sm text-slate-600">Chat with us instantly</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleContactOptionClick('email')}
                  className="w-full p-4 bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">Email</div>
                      <div className="text-sm text-slate-600">{import.meta.env.VITE_SHOP_EMAIL || 'contact@startailors.com'}</div>
                    </div>
                  </div>
                </button>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full mt-4 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors duration-200"
              >
                Close
              </button>
              
              {/* Safe area padding for mobile */}
              <div className="h-6" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StarChatbot;