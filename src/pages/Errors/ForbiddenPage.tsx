import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-950/30 border border-red-900 mb-6">
          <ShieldX className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-5xl font-bold text-[#D4AF37] mb-2">403</h1>
        <h2 className="text-xl font-semibold text-white mb-3">Access Denied</h2>
        <p className="text-gray-400 text-sm mb-8">
          You don't have permission to access this page.
          If you believe this is an error, please contact an administrator.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D4AF37] text-black font-bold text-sm hover:bg-[#c29f2f] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
