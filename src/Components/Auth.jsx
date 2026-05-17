import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for routing
import { useFinance } from './FinanceContext';

export const Auth = () => {
  const { loginWithGoogle, user, loading } = useFinance();
  const navigate = useNavigate();

  // Redirect automatically when user status updates to 'authenticated'
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium animate-pulse">
            Checking authentication status...
          </p>
        </div>
      </div>
    );
  }

  // Prevent ui flicker if user exists but redirect is executing
  if (user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100/80 transform transition-all">
        
        {/* Decorative Top Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 shadow-md shadow-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">
            Finance Hub
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Securely track, visualize, and control your cloud transactions.
          </p>
        </div>

        {/* Feature Highlights Panel */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="flex h-2 w-2 rounded-full bg-amber-700"></span>
            Real-time ledger updates with Firestore
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="flex h-2 w-2 rounded-full bg-amber-700"></span>
            Dynamic analytical charts and metrics
          </div>
        </div>

        {/* Action Button Container */}
        <div className="mt-6">
          <button
            onClick={loginWithGoogle}
            className="group relative flex w-full justify-center items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          >
            {/* Google Vector Icon Wrapper */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-1.00 7.28-2.69l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.07c-.22-.66-.35-1.36-.35-2.07s.13-1.41.35-2.07V7.09H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.91l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.09l3.66 2.84c.87-2.6 3.3-4.55 6.16-4.55z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer Security Note */}
        <div className="text-center text-xs text-gray-400">
          Protected by Firebase Authentication systems.
        </div>
      </div>
    </div>
  );
};