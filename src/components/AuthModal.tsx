import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Key, User, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { TEAMS } from '../data/mockPlayers';

interface Props {
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ onClose }) => {
  const { login, signUpPlayer } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignInPass, setShowSignInPass] = useState(false);

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPass, setShowSignUpPass] = useState(false);
  const [signUpSquad, setSignUpSquad] = useState<string>(TEAMS[0]);
  const [signUpOvr, setSignUpOvr] = useState(85);
  const [signUpPhone, setSignUpPhone] = useState('+880 17');
  const [signUpJersey, setSignUpJersey] = useState(10);

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setMessage({ text: 'Please enter both Email and Password', type: 'error' });
      return;
    }
    const result = login(email, password);
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim()) {
      setMessage({ text: 'Please provide your Name and Email', type: 'error' });
      return;
    }

    if (!signUpPassword.trim() || signUpPassword.length < 4) {
      setMessage({ text: 'Password must be at least 4 characters long', type: 'error' });
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setMessage({ text: 'Passwords do not match. Please check again.', type: 'error' });
      return;
    }

    const result = signUpPlayer({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      squadName: signUpSquad,
      ovr: signUpOvr,
      phone: signUpPhone,
      jerseyNumber: signUpJersey
    });

    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#12192c] border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Messi Goat FC Account</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Clean "Sign In" and "Join as New Player" */}
        <div className="flex border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setMode('signin');
              setMessage(null);
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setMessage(null);
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Join as New Player
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`m-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="overflow-y-auto p-4 space-y-3.5">
          {mode === 'signin' ? (
            /* Clean Sign In Form without any test filler buttons */
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Email</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignInPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-9 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPass(!showSignInPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showSignInPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                <p>Official Admin: <span className="font-mono text-amber-300">admingoat@gmail.com</span></p>
                <p>Official Mod: <span className="font-mono text-cyan-300">joy@gmail.com</span></p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Sign In to Messi Goat FC
              </button>
            </form>
          ) : (
            /* Sign Up / Join Form with Password and Firebase persistence */
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Saif Meer"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="youremail@gmail.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Password Fields */}
              <div className="space-y-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignUpPass ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="At least 4 characters"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-9 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPass(!showSignUpPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showSignUpPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignUpPass ? 'text' : 'password'}
                      required
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Squad Name</label>
                  <select
                    value={signUpSquad}
                    onChange={(e) => setSignUpSquad(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white font-bold"
                  >
                    {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Jersey #</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={signUpJersey}
                    onChange={(e) => setSignUpJersey(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-300 font-bold">Team OVR Rating (1 - 200)</label>
                  <span className="text-amber-400 font-mono font-black text-sm">{signUpOvr}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={signUpOvr}
                  onChange={(e) => setSignUpOvr(parseInt(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                  <span>1 (Novice)</span>
                  <span>100 (Starter)</span>
                  <span>200 (GOAT)</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  placeholder="+880 1711-xxxxxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Register & Join Messi Goat FC
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
