import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🧵</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Page Not Found</h1>
          <p className="text-slate-600">
            Oops! The page you're looking for seems to have been misplaced like a lost button.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center px-6 py-3 bg-rose-600 text-white rounded-2xl font-medium hover:bg-rose-700 transition-colors min-h-[48px]"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-2xl font-medium hover:bg-slate-50 transition-colors min-h-[48px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;