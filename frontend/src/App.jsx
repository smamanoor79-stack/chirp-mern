import { useRef, useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import UserProfileView from './components/UserProfileView';

export default function App() {
  const { token, user } = useAuth();
  const [view, setView] = useState({ type: 'feed' });
  const textareaRef = useRef(null);

  if (!token || !user) {
    return <AuthScreen />;
  }

  function handleNavigate(type) {
    setView({ type });
  }

  function handleViewProfile(userId) {
    if (userId === user._id) {
      setView({ type: 'profile' });
    } else {
      setView({ type: 'user', id: userId });
    }
  }

  function handleCompose() {
    setView({ type: 'feed' });
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  const title = view.type === 'feed' ? 'Home' : 'Profile';
  const sidebarView = view.type === 'user' ? null : view.type;

  return (
    <div className="app-screen">
      <Sidebar view={sidebarView} onNavigate={handleNavigate} onCompose={handleCompose} />

      <main className="main-content">
        <header className="feed-header">
          <h2>{title}</h2>
        </header>

        {view.type === 'feed' && <HomeView onViewProfile={handleViewProfile} textareaRef={textareaRef} />}
        {view.type === 'profile' && <ProfileView onViewProfile={handleViewProfile} />}
        {view.type === 'user' && <UserProfileView userId={view.id} onViewProfile={handleViewProfile} />}
      </main>

      <RightPanel />
    </div>
  );
}
