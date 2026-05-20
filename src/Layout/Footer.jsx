// src/Components/Footer.jsx
import  { useState } from 'react';
import { 
  ShieldCheck, ArrowUpRight, Check, Mail,
  Twitter, Linkedin, Youtube, ShieldAlert
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Simulate API registration
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs mt-12 transition-all duration-200">
      {/* Primary 4-Column Grid Structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* COLUMN 1: Company & Mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1 rounded font-black text-[10px] tracking-tighter">PFH</div>
            <span className="font-bold text-slate-200 text-sm">FinAnalytics Hub</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Empowering individuals with intelligent automation pipelines, ledger management engines, and frictionless M-PESA utility orchestration tracking layers.
          </p>
          <ul className="space-y-2 pt-1">
            <li><a href="#about" className="hover:text-blue-400 transition-colors flex items-center gap-0.5">About Us <ArrowUpRight size={12} className="text-slate-600" /></a></li>
            <li><a href="#careers" className="hover:text-blue-400 transition-colors">Careers <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 ml-1">Hiring</span></a></li>
            <li><a href="#press" className="hover:text-blue-400 transition-colors">Press & Media</a></li>
            <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact Support</a></li>
          </ul>
        </div>

        {/* COLUMN 2: Resources & Tools */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Resources & Tools</h3>
          <ul className="space-y-2">
            <li><a href="#calculators" className="hover:text-blue-400 transition-colors">Financial Calculators</a></li>
            <li><a href="#blog" className="hover:text-blue-400 transition-colors">Budgeting & Debt Guides</a></li>
            <li><a href="#glossary" className="hover:text-blue-400 transition-colors">Beginner Financial Glossary</a></li>
          </ul>
          {/* Newsletter Embedded Block */}
          <div className="pt-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Weekly Market Insights</label>
            <form onSubmit={handleSubscribe} className="flex gap-1.5 max-w-xs">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com" 
                className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2.5 text-slate-200 focus:outline-none focus:border-blue-500 w-full text-[11px]"
              />
              <button 
                type="submit" 
                className={`px-3 py-1.5 rounded-lg text-white font-semibold transition-colors flex items-center justify-center shrink-0 ${subscribed ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {subscribed ? <Check size={14} /> : <Mail size={14} />}
              </button>
            </form>
          </div>
        </div>

        {/* COLUMN 3: Legal & Disclosures */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1">
            <ShieldAlert size={12} className="text-amber-500" /> Compliance & Legal
          </h3>
          <ul className="space-y-2">
            <li><a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy Matrix</a></li>
            <li><a href="#terms" className="hover:text-blue-400 transition-colors">Terms of Cloud Service</a></li>
            <li><a href="#affiliate" className="hover:text-blue-400 transition-colors">FTC Advertising Disclosure</a></li>
          </ul>
          <p className="text-[10px] text-slate-500 leading-relaxed bg-slate-950/40 p-2 rounded border border-slate-800/60">
            <strong>Disclaimer:</strong> Content across this domain platform serves educational and computational illustration purposes only. Nothing here constitutes professional financial, legal, or fiduciary tax advice.
          </p>
        </div>

        {/* COLUMN 4: Trust & Social Proof */}
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] mb-2">Connect Channels</h3>
            <div className="flex items-center gap-2.5">
              <a href="#twitter" className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:text-blue-400 hover:border-slate-700 transition-all" title="Follow on X"><Twitter size={14} /></a>
              <a href="#linkedin" className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:text-blue-400 hover:border-slate-700 transition-all" title="Connect on LinkedIn"><Linkedin size={14} /></a>
              <a href="#youtube" className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:text-rose-400 hover:border-slate-700 transition-all" title="Subscribe on YouTube"><Youtube size={14} /></a>
            </div>
          </div>

          {/* Verification Badges Section */}
          <div className="space-y-2 border-t border-slate-800/60 pt-3">
            <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-800 rounded-lg p-2">
              <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-slate-300 font-semibold text-[10px]">AES-256 Bit Encryption</p>
                <p className="text-slate-600 text-[9px]">SSL Secured Sandbox Environment</p>
              </div>
            </div>
            <div className="text-[9px] text-slate-600 font-mono leading-tight pl-1">
              Registered Interface ID: <span className="text-slate-500">RIA-#99281-2026</span><br />
              Brokerage Auditing Authority License cleared.
            </div>
          </div>
        </div>

      </div>

      {/* Deep Bottom Sub-Footer Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/40 py-4 px-4 sm:px-6 lg:px-8 text-center text-[10px] text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 FinAnalytics Hub Systems. All Rights Reserved globally.</p>
          <p className="font-mono">IP Protocol Protection Layer Active</p>
        </div>
      </div>
    </footer>
  );
}