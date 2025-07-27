import React from 'react';

interface Props {
  onSignOut: () => void;
}

const Dashboard: React.FC<Props> = ({ onSignOut }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center pt-8">
      <div className="w-[350px] flex items-center justify-between font-semibold text-lg mb-4">
        <span className="text-2xl">🌟</span> Dashboard
        <button className="text-blue-600 cursor-pointer text-base underline" onClick={onSignOut}>Sign Out</button>
      </div>
      <div className="w-[350px] bg-white rounded-xl shadow p-6 flex flex-col items-center gap-3">
        <div className="text-xl font-bold mb-1">Welcome, Jonas Khanwald !</div>
        <div className="text-base text-gray-500 mb-3">Email: xxxxxx@xxxx.com</div>
        <button className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold text-base shadow mb-2">Create Note</button>
        <div className="w-full mt-3 flex flex-col gap-2">
          <div className="bg-slate-100 rounded-md px-3 py-2 flex items-center justify-between text-base">Note 1 <span className="cursor-pointer ml-2">🗑️</span></div>
          <div className="bg-slate-100 rounded-md px-3 py-2 flex items-center justify-between text-base">Note 2 <span className="cursor-pointer ml-2">🗑️</span></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
