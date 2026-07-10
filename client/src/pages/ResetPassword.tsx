import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Video, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!token) {
      setError('Password reset token is missing or invalid.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8 || !password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
      setError('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/reset-password', { password }, { params: { token } });
      setSuccessMessage('Your password has been successfully reset. You can now log in.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed. The token may be expired or invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-primary-bg">
      <ThemeToggle />
      <div className="hidden md:flex md:flex-col md:justify-center md:flex-[0_0_60%] p-12 bg-[radial-gradient(circle_at_0%_0%,var(--gradient-start)_0%,var(--gradient-end)_70%)] relative overflow-hidden">
        <div className="relative z-10 max-w-[600px]">
          <div className="flex items-center gap-3 text-2xl font-extrabold text-text-main mb-8 tracking-tight">
            <Video size={32} />
            <span>IntellMeet</span>
          </div>
          
          <h1 className="text-4xl lg:text-[2.5rem] font-extrabold leading-tight mb-4 text-text-main tracking-tighter">AI-Powered Enterprise Meeting & Collaboration Platform</h1>
          <p className="text-[1.05rem] text-text-muted mb-10 leading-relaxed">
            Real-time video meetings, AI summaries, smart action items, and team collaboration in one secure platform.
          </p>
        </div>
      </div>

      <div className="flex-1 md:flex-[0_0_40%] w-full flex items-center justify-center p-4 md:p-8 bg-primary-bg relative">
        <div className="bg-glass-bg backdrop-blur-[20px] border border-glass-border rounded-[28px] p-8 md:p-12 w-full max-w-[440px] shadow-card-shadow animate-slide-up">
          <h1 className="text-3xl font-bold mb-1 text-center tracking-tight text-text-main">Reset Password</h1>
          <p className="text-text-muted text-sm text-center mb-8">Enter your new secure password below</p>
          
          {error && <div className="bg-red-500/8 text-error p-[0.85rem] rounded-[14px] text-sm mb-6 border border-red-500/15">{error}</div>}
          
          {successMessage ? (
            <div className="text-center">
              <div className="bg-green-500/8 text-green-500 p-[1.15rem] rounded-[14px] text-sm mb-6 border border-green-500/15 leading-relaxed font-medium">
                {successMessage}
              </div>
              <Link to="/login" className="inline-flex items-center gap-2 text-text-main text-sm font-semibold hover:underline">
                <ArrowLeft size={16} /> Go to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="password" className="block text-[0.85rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">New Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full py-[0.85rem] pr-12 pl-12 bg-input-bg border border-border-color rounded-[14px] text-text-main text-[0.95rem] transition-all duration-200 outline-none focus:border-text-main focus:ring-2 focus:ring-border-color peer"
                  />
                  <Lock className="absolute left-[1.15rem] text-text-muted w-[1.15rem] h-[1.15rem] transition-colors duration-200 peer-focus:text-text-main" size={20} />
                  <button 
                    type="button" 
                    className="absolute right-[1.15rem] bg-transparent border-none text-text-muted hover:text-text-main cursor-pointer flex items-center justify-center p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-[0.85rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Confirm New Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full py-[0.85rem] pr-12 pl-12 bg-input-bg border border-border-color rounded-[14px] text-text-main text-[0.95rem] transition-all duration-200 outline-none focus:border-text-main focus:ring-2 focus:ring-border-color peer"
                  />
                  <Lock className="absolute left-[1.15rem] text-text-muted w-[1.15rem] h-[1.15rem] transition-colors duration-200 peer-focus:text-text-main" size={20} />
                </div>
              </div>
              
              <button type="submit" className="w-full py-[0.85rem] bg-accent-color text-primary-bg border-none rounded-[14px] text-[0.95rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-accent-hover hover:-translate-y-px mb-6" disabled={isLoading}>
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <Link to="/login" className="block text-center text-text-muted text-sm no-underline hover:text-text-main">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <ArrowLeft size={16} /> Cancel and Back to Sign In
                </span>
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
