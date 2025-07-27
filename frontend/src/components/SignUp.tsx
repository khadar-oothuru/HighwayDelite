import React, { useState } from 'react';

interface Props {
  onSwitch: (page: string) => void;
}

const SignUp: React.FC<Props> = ({ onSwitch }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="flex-1 flex flex-col items-center justify-center py-8 bg-white rounded-tl-2xl rounded-bl-2xl border border-r-0 border-gray-200 shadow-none">
        <div className="flex items-center font-semibold text-xl mb-8 gap-2">
          <span className="text-2xl mr-1">🌟</span> <span className="font-bold text-xl text-gray-900">HD</span>
        </div>
        <div className="w-80 bg-white rounded-xl shadow p-6 flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-1">Sign up</h2>
          <p className="text-base text-gray-500 mb-4">Sign up to enjoy the feature of HD</p>
          <div className="text-sm text-gray-700 mt-2 mb-1">Your Name</div>
          <input className="w-full px-3 py-2 border border-gray-300 rounded-md text-base mb-1 outline-none" value={name} onChange={e => setName(e.target.value)} placeholder="Jonas Khanwald" />
          <div className="text-sm text-gray-700 mt-2 mb-1">Date of Birth</div>
          <input className="w-full px-3 py-2 border border-gray-300 rounded-md text-base mb-1 outline-none" value={dob} onChange={e => setDob(e.target.value)} placeholder="11 December 1997" />
          <div className="text-sm text-gray-700 mt-2 mb-1">Email</div>
          <input className="w-full px-3 py-2 border border-gray-300 rounded-md text-base mb-1 outline-none" value={email} onChange={e => setEmail(e.target.value)} placeholder="jonas_kahnwald@gmail.com" />
          <button className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold text-base my-3 shadow" type="button">Get OTP</button>
          <div className="text-sm text-gray-600 mt-2 text-left">Already have an account?? <span className="text-blue-600 cursor-pointer underline ml-1" onClick={() => onSwitch('signin')}>Sign in</span></div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-black rounded-tr-2xl rounded-br-2xl overflow-hidden">
        <img src="https://wallpapercave.com/wp/wp10292836.jpg" alt="bg" className="w-full h-full object-cover rounded-tr-2xl rounded-br-2xl" />
      </div>
    </div>
  );
};

export default SignUp;
