import  { useState } from 'react';
import { useFinance } from '../Components/FinanceContext';
import { Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const { registerWithEmail, loginWithEmail, loginWithGoogle } = useFinance();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmission = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message.replace("Firebase: ", ""));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Visual accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-red-400 to-emerald-500 rounded-b-full"></div>

        <div className="text-center mb-8">
          <div className="inline-block bg-amber-600 px-3 py-1 rounded-lg text-white font-black text-xs tracking-tighter mb-3">
            PFAH CORE
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isRegistering ? "Create System Account" : "Access Account Ledger"}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            {isRegistering ? "Register credentials to provision ledger state" : "Secure operational  dashboard access"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-400">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmission} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email :</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-600" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-half bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Security Code(Password):</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-600" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-half bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-half bg-slate-950 hover:bg-amber-500 active:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-md shadow-blue-600/10 mt-6"
          >
            {isRegistering ? "Execute Core Provisioning" : "Verify and Initialize Access"}
            <ChevronRight size={14} />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800/80"></div></div>
          <span className="relative bg-slate-900 px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Or Continue With</span>
        </div>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Blue: Right section & G-arm */}
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
  
            {/* Green: Bottom curve */}
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
  
            {/* Yellow: Left slice */}
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
  
            {/* Red: Top curve */}
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Google Account
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors focus:outline-none"
          >
            {isRegistering ? "Already registered? Sign In" : "Dont have an account? Register an account"}
          </button>
        </div>

      </div>
    </div>
  );
}