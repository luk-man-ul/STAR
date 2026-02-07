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

    // Handle navigation for "Book Now"
    if (action === 'book-now') {
      navigate('/book');
    }

    setIsModalOpen(false);
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
    </>
  );
};

export default StarChatbot;