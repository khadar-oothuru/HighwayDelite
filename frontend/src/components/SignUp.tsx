import React, { useState } from 'react';
import logoImg from '../assets/image.png';
import { User, Calendar, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  onSwitch: (page: string) => void;
}

import { sendOtp, verifyOtp } from '../config/api';

const SignUp: React.FC<Props> = ({ onSwitch }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to format date to YYYY-MM-DD
  const formatDob = (input: string) => {
    // Accepts '11 December 1997' or '1997-12-11' and returns '1997-12-11'
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
    const d = new Date(input);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
    return input;
  };

  const handleGetOtp = async () => {
    if (!name || !dob || !email) {
      toast.error('Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      const dateOfBirth = formatDob(dob);
      await sendOtp({ email, name, dateOfBirth });
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP!');
      return;
    }
    setLoading(true);
    try {
      const dateOfBirth = formatDob(dob);
      await verifyOtp({ email, otp, name, dateOfBirth });
      toast.success('Sign up successful!');
      // Optionally, store token/user info here
      onSwitch('signin');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center py-8 bg-white">
        <div className="w-96 px-8">
          <div className="flex items-center mb-10 gap-2">
            <img src={logoImg} alt="Logo" className="h-8 w-8 object-contain mr-1" />
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">HD</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Sign up</h2>
          <p className="text-base text-gray-500 mb-8">Sign up to enjoy the feature of HD</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block tracking-wide">Your Name</label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base outline-none focus:border-blue-500 transition-colors bg-gray-50 placeholder-gray-400"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jonas Khanwald"
                disabled={otpSent}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block tracking-wide">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-base outline-none focus:border-blue-500 transition-colors bg-gray-50 placeholder-gray-400"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  placeholder="11 December 1997"
                  disabled={otpSent}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block tracking-wide">Email</label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base outline-none focus:border-blue-500 transition-colors bg-gray-50 placeholder-gray-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jonas_kahnwald@gmail.com"
                type="email"
                disabled={otpSent}
              />
            </div>

            {otpSent && (
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block tracking-wide">OTP</label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base outline-none focus:border-blue-500 transition-colors bg-gray-50 placeholder-gray-400"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                />
              </div>
            )}
          </div>

          {!otpSent ? (
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base mt-8 transition-colors shadow-sm disabled:opacity-60"
              type="button"
              onClick={handleGetOtp}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Get OTP'}
            </button>
          ) : (
            <button
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-base mt-8 transition-colors shadow-sm disabled:opacity-60"
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP & Sign Up'}
            </button>
          )}
          
          <div className="text-sm text-gray-400 mt-6 text-center">
            Already have an account??
            <span className="text-blue-600 cursor-pointer hover:underline ml-1 font-medium" onClick={() => onSwitch('signin')}>
              Sign in
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-gradient-to-br from-blue-900 to-black rounded-l-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <img 
          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop" 
          alt="Abstract blue waves" 
          className="w-full h-full object-cover opacity-80 mix-blend-overlay"
        />
        {/* You can replace the image with a better match for the blue wave pattern shown in your design */}
      </div>
    </div>
  );
};

export default SignUp;