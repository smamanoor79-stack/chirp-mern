import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { saveSession } = useAuth();

  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupError, setSignupError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleSignup() {
    setSignupError('');
    const { name, email, password } = signupData;
    if (!name.trim() || !email.trim() || !password) {
      setSignupError('Please fill all fields');
      return;
    }
    setIsSigningUp(true);
    try {
      const data = await api.signup({ name: name.trim(), email: email.trim(), password });
      saveSession(data);
    } catch (err) {
      setSignupError(err.message);
    } finally {
      setIsSigningUp(false);
    }
  }

  async function handleLogin() {
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const data = await api.login({ email: loginData.email.trim(), password: loginData.password });
      saveSession(data);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-left">
        <svg className="brand-icon-big" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
        </svg>
        <h2 className="hero-text">Happening now</h2>
        <h3 className="hero-sub">Join Chirp today.</h3>

        <div id="signup-form">
          <input
            type="text"
            placeholder="Full name"
            value={signupData.name}
            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          />
          <button className="primary-btn" onClick={handleSignup} disabled={isSigningUp}>
            {isSigningUp ? <span className="spinner"></span> : 'Create account'}
          </button>
          <p className="error">{signupError}</p>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <div id="login-form">
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <button className="secondary-btn" onClick={handleLogin} disabled={isLoggingIn}>
            {isLoggingIn ? <span className="spinner"></span> : 'Log in'}
          </button>
          <p className="error">{loginError}</p>
        </div>
      </div>
    </div>
  );
}