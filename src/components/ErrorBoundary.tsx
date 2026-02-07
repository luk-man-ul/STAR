import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error caught by boundary:', error, errorInfo);
    
    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would send error to logging service
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
    
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              {/* Error Icon */}
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              {/* Error Message */}
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-slate-600 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified and we're working on a fix.
              </p>
              
              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 rounded-2xl text-left">
                  <h3 className="font-medium text-red-800 mb-2">Error Details:</h3>
                  <p className="text-sm text-red-700 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center px-6 py-3 bg-rose-600 text-white rounded-2xl font-medium hover:bg-rose-700 transition-colors min-h-[48px]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full flex items-center justify-center px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-2xl font-medium hover:bg-slate-50 transition-colors min-h-[48px]"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </button>
              </div>
              
              {/* Support Contact */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Need help? Contact our support team at{' '}
                  <a 
                    href="mailto:support@stitchingcenter.com" 
                    className="text-rose-600 hover:text-rose-700"
                  >
                    support@stitchingcenter.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;