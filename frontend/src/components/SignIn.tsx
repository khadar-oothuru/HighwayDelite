
import React, { useState } from 'react';
import logoImg from '../assets/image.png';
import blueAbstract from "../assets/img19.webp"
import { Eye, EyeOff } from 'lucide-react';
import { sendOtp, verifyOtp } from '../config/api';
import { toast } from 'react-toastify';

interface Props {
  onSwitch: (page: string) => void;
  onSignInSuccess: (user: any) => void;
}

const SignIn: React.FC<Props> = ({ onSwitch, onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error('Please enter your email first!');
      return;
    }
    setLoading(true);
    try {
      await sendOtp({ email, mode: 'signin' });
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !otp) {
      toast.error('Please enter both email and OTP!');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp, mode: 'signin' });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Sign in successful!');
      if (onSignInSuccess) onSignInSuccess(user);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center py-8 bg-white">
        <div className="w-96 px-8">
          <div className="flex items-center font-semibold text-xl mb-8 gap-2">
            <img src={logoImg} alt="Logo" className="h-8 w-8 object-contain mr-1" />
            <span className="font-bold text-xl text-gray-900">HD</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Sign in</h2>
          <p className="text-base text-gray-500 mb-8">Please login to continue to your account.</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Email</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-500 transition-colors"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setOtp('');
                  setOtpSent(false);
                }}
                placeholder="jonas_kahnwald@gmail.com"
                type="email"
                disabled={otpSent}
              />
            </div>

            {otpSent && (
              <div>
                <label className="text-sm text-gray-600 mb-2 block">OTP</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-base outline-none focus:border-blue-500 transition-colors"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    type={showOtp ? 'text' : 'password'}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    type="button"
                    onClick={() => setShowOtp(s => !s)}
                  >
                    {showOtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="keepLoggedIn" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
              />
              <label htmlFor="keepLoggedIn" className="text-sm text-gray-700 ml-2">
                Keep me logged in
              </label>
            </div>
          </div>
          
          {!otpSent ? (
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base mt-6 transition-colors disabled:opacity-60"
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          ) : (
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base mt-6 transition-colors disabled:opacity-60"
              type="button"
              onClick={handleSignIn}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          )}
          
          <div className="text-sm text-gray-600 mt-6 text-center">
            Need an account? 
            <span className="text-blue-600 cursor-pointer hover:underline ml-1" onClick={() => onSwitch('signup')}>
              Create one
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 rounded-l-3xl overflow-hidden relative">
        <img
          src={blueAbstract}
          alt="Abstract blue waves"
          className="w-full h-full object-cover"
          style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </div>
  );
};

export default SignIn;