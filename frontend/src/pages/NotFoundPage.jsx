import { Link } from 'react-router-dom';
import { Brain, Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-navy-900 flex items-center justify-center text-center px-4">
    <div>
      <div className="w-20 h-20 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-brand">
        <Brain className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-8xl font-black text-gradient mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
        <Home className="w-4 h-4" /> Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
