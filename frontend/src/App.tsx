
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp onSwitch={page => window.location.replace(page === 'signin' ? '/signin' : '/signup')} />} />
        <Route path="/signin" element={<SignIn onSwitch={page => window.location.replace(page === 'signup' ? '/signup' : '/signin')} />} />
        <Route path="/dashboard" element={<Dashboard onSignOut={() => window.location.replace('/signin')} />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
