import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'card' | 'banner';
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry,
  onDismiss,
  variant = 'card',
  className = ''
}) => {
  const baseClasses = 'flex items-start space-x-3';
  
  const variantClasses = {
    inline: 'p-3 bg-red-50 border border-red-200 rounded-2xl',
    card: 'p-6 bg-white border border-red-200 rounded-3xl shadow-sm',
    banner: 'p-4 bg-red-50 border-l-4 border-red-500'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Error Icon */}
      <div className="flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-red-600" />
      </div>
      
      {/* Error Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-red-800 mb-1">
          {title}
        </h3>
        <p className="text-sm text-red-700">
          {message}
        </p>
        
        {/* Action Buttons */}
        {(onRetry || onDismiss) && (
          <div className="mt-3 flex space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-red-300 text-red-700 text-sm font-medium rounded-full hover:bg-red-50 transition-colors"
              >
                <X className="w-3 h-3 mr-1" />
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;