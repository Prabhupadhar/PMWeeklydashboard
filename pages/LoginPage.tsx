
import React, { useState } from 'react';
import { User } from '../types';
import { LogIn, BrainCircuit, Sparkles, Zap } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      onLogin({ email, name });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px] opacity-50"></div>

      <div className="relative z-10 w-full max-w-lg p-4">
        <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 p-10 md:p-14">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 ai-gradient-bg rounded-2xl flex items-center justify-center mb-6 float-anim ai-glow">
              <BrainCircuit className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              PM Status <span className="text-purple-600">Brain</span>
            </h1>
            <p className="text-slate-500 mt-3 text-lg text-center max-w-xs leading-relaxed">
              Experience project reporting at the speed of thought.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Work Identity</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                placeholder="What should we call you?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Professional Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                placeholder="name@company.com"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full ai-gradient-bg text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_8px_20px_-4px_rgba(124,58,237,0.4)]"
              >
                Launch Your Dashboard
                <Zap className="w-5 h-5 fill-current" />
              </button>
            </div>
          </form>

          <div className="mt-12 flex items-center justify-center gap-6 text-slate-400">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Powered
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
              Executive Grade
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
