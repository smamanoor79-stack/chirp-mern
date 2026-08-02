import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function Sidebar({ view, onNavigate, onCompose }) {
  const { user, logout } = useAuth();

  function handleLogout() {
    if (window.confirm('Log out of Chirp?')) logout();
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
        </svg>
      </div>

      <a className={`nav-item ${view === 'feed' ? 'active' : ''}`} onClick={() => onNavigate('feed')}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
          <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.41.456-.41.766v13.087h6.999v-7.989h5.005l-.001 7.989h6.999V7.911c0-.31-.151-.592-.41-.765z" />
        </svg>
        <span>Home</span>
      </a>
      <a className={`nav-item ${view === 'profile' ? 'active' : ''}`} onClick={() => onNavigate('profile')}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
          <path d="M5.651 19h12.698c-.337-1.8-1.913-3.18-3.829-3.18-.243 0-.486.018-.713.054-.473.073-1.06.225-1.807.225-.747 0-1.331-.152-1.804-.225-.227-.036-.47-.054-.713-.054-1.916 0-3.494 1.38-3.831 3.18zm14.717.962C19.708 16.034 16.65 13.82 13 13.82c-.422 0-.834.034-1.234.097-.738.124-1.272.35-2.072.35-.798 0-1.332-.226-2.07-.35A8.07 8.07 0 0 0 6.39 13.82c-3.652 0-6.708 2.213-7.368 6.143A1.001 1.001 0 0 0 0 21h24a1 1 0 0 0 .388-1.038z" />
          <circle cx="13" cy="7.5" r="5.5" />
        </svg>
        <span>Profile</span>
      </a>

      <button className="compose-btn-side" onClick={onCompose}>
        Post
      </button>

      <div className="sidebar-user" onClick={handleLogout}>
        <Avatar name={user?.name} picture={user?.profilePicture} />
        <div className="sidebar-user-info">
          <div className="sidebar-name">{user?.name}</div>
          <div className="sidebar-handle">Log out</div>
        </div>
      </div>
    </nav>
  );
}
