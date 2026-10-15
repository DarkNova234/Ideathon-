import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Search } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <Search className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">404 - Not Found</h1>
      <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
        The requested case, animal tag, or page could not be located in the StraySafe pilot database.
      </p>
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
        <Link
          href="/report"
          className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          Report an Animal
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};
