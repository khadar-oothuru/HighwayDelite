import React, { useState } from 'react';

interface Props {
  onSwitch: (page: string) => void;
}

const SignIn: React.FC<Props> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="flex-1 flex flex-col items-center justify-center py-8 bg-white rounded-tl-2xl rounded-bl-2xl border border-r-0 border-gray-200 shadow-none">
        <div className="flex items-center font-semibold text-xl mb-8 gap-2">
          <span className="text-2xl mr-1">🌟</span> <span className="font-bold text-xl text-gray-900">HD</span>
        </div>
        <div className="w-80 bg-white rounded-xl shadow p-6 flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-1">Sign in</h2>
          <p className="text-base text-gray-500 mb-4">Please login to continue to your account.</p>
          <div className="text-sm text-gray-700 mt-2 mb-1">Email</div>
          <input className="w-full px-3 py-2 border border-gray-300 rounded-md text-base mb-1 outline-none" value={email} onChange={e => setEmail(e.target.value)} placeholder="jonas_kahnwald@gmail.com" />
          <div className="text-sm text-gray-700 mt-2 mb-1">OTP</div>
          <div className="flex items-center">
            <input className="w-full px-3 py-2 border border-gray-300 rounded-md text-base mb-1 outline-none" value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" type={showOtp ? 'text' : 'password'} />
            <button className="bg-none border-none text-lg cursor-pointer ml-2" type="button" onClick={() => setShowOtp(s => !s)}>{showOtp ? '🙈' : '👁️'}</button>
          </div>
          <div className="text-sm text-gray-600 mb-2"><span className="text-blue-600 cursor-pointer underline">Resend OTP</span></div>
          <div className="flex items-center mb-2">
            <input type="checkbox" id="keepLoggedIn" className="mr-2" />
            <label htmlFor="keepLoggedIn" className="text-sm">Keep me logged in</label>
          </div>
          <button className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold text-base my-3 shadow" type="button">Sign in</button>
          <div className="text-sm text-gray-600 mt-2 text-left">Need an account? <span className="text-blue-600 cursor-pointer underline ml-1" onClick={() => onSwitch('signup')}>Create one</span></div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-black rounded-tr-2xl rounded-br-2xl overflow-hidden">
        <img src="https://wallpapercave.com/wp/wp10292836.jpg" alt="bg" className="w-full h-full object-cover rounded-tr-2xl rounded-br-2xl" />
      </div>
    </div>
  );
};

export default SignIn;
