

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';

const App = () => {
  const [user, setUser] = useState<any>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = (window as any).navigate || ((path: string) => { window.location.replace(path); });

  useEffect(() => {
    (window as any).navigate = (path: string) => {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };
  }, []);

  const handleSignInSuccess = (userObj: any) => {
    setUser(userObj);
    navigate('/dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <BrowserRouter>
        <Routes>
          <Route
            path="/signup"
            element={
              user ? <Navigate to="/dashboard" replace /> : <SignUp onSwitch={page => navigate(page === 'signin' ? '/signin' : '/signup')} />
            }
          />
          <Route
            path="/signin"
            element={
              user ? <Navigate to="/dashboard" replace /> : <SignIn onSwitch={page => navigate(page === 'signup' ? '/signup' : '/signin')} onSignInSuccess={handleSignInSuccess} />
            }
          />
          <Route path="/dashboard" element={user ? <Dashboard onSignOut={handleSignOut} user={user} /> : <Navigate to="/signin" replace />} />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/signup'} replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
