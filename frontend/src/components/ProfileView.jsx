import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Avatar from './Avatar';
import FeedList from './FeedList';
import UserListModal from './UserListModal';

export default function ProfileView({ onViewProfile }) {
  const { token, user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [stats, setStats] = useState({ following: [], followers: [] });
  const [posts, setPosts] = useState([]);
  const [modal, setModal] = useState(null); // { title, users } | null

  async function load() {
    const fullUser = await api.getUser(user._id);
    setStats({ following: fullUser.following || [], followers: fullUser.followers || [] });
    const userPosts = await api.getUserPosts(user._id);
    setPosts(userPosts);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDeleted(postId) {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert('Please choose an image smaller than 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      try {
        await api.updateMe(token, { profilePicture: base64Image });
        updateUser({ profilePicture: base64Image });
      } catch (err) {
        alert(err.message);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="profile-header">
        <Avatar name={user.name} picture={user.profilePicture} className="avatar-xl" />
        <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleAvatarChange} />
        <button
          className="secondary-btn"
          style={{ width: 'auto', padding: '8px 16px', fontSize: '13px', marginBottom: '10px' }}
          onClick={() => fileInputRef.current.click()}
        >
          Change photo
        </button>
        <h2>{user.name}</h2>
        <p className="muted">{user.email}</p>
        <div className="profile-stats">
          <span style={{ cursor: 'pointer' }} onClick={() => setModal({ title: 'Following', users: stats.following })}>
            <strong>{stats.following.length}</strong> Following
          </span>
          <span style={{ cursor: 'pointer' }} onClick={() => setModal({ title: 'Followers', users: stats.followers })}>
            <strong>{stats.followers.length}</strong> Followers
          </span>
        </div>
      </div>
      <FeedList posts={posts} onDeleted={handleDeleted} onViewProfile={onViewProfile} />

      {modal && (
        <UserListModal
          title={modal.title}
          users={modal.users}
          onClose={() => setModal(null)}
          onSelectUser={onViewProfile}
        />
      )}
    </div>
  );
}
