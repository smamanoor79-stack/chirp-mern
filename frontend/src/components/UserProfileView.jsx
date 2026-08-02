import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Avatar from './Avatar';
import FeedList from './FeedList';
import UserListModal from './UserListModal';

export default function UserProfileView({ userId, onViewProfile }) {
  const { token, user: me } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followHover, setFollowHover] = useState(false);
  const [modal, setModal] = useState(null);

  async function load() {
    const u = await api.getUser(userId);
    setProfileUser(u);
    setIsFollowing(u.followers?.some((id) => id.toString() === me._id));
    const userPosts = await api.getUserPosts(userId);
    setPosts(userPosts);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  function handleDeleted(postId) {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  }

  async function handleToggleFollow() {
    try {
      const data = await api.toggleFollow(token, userId);
      setIsFollowing(data.following);
    } catch (err) {
      alert('Could not update follow status');
    }
  }

  if (!profileUser) return null;

  return (
    <div>
      <div className="profile-header">
        <Avatar name={profileUser.name} picture={profileUser.profilePicture} className="avatar-xl" />
        <h2>{profileUser.name}</h2>
        <p className="muted">{profileUser.email}</p>
        <button
          className={`follow-btn-small ${isFollowing ? 'following' : ''}`}
          style={{ margin: '8px 0' }}
          onClick={handleToggleFollow}
          onMouseEnter={() => setFollowHover(true)}
          onMouseLeave={() => setFollowHover(false)}
        >
          {isFollowing ? (followHover ? 'Unfollow' : 'Following') : 'Follow'}
        </button>
        <div className="profile-stats">
          <span style={{ cursor: 'pointer' }} onClick={() => setModal({ title: 'Following', users: profileUser.following })}>
            <strong>{profileUser.following?.length || 0}</strong> Following
          </span>
          <span style={{ cursor: 'pointer' }} onClick={() => setModal({ title: 'Followers', users: profileUser.followers })}>
            <strong>{profileUser.followers?.length || 0}</strong> Followers
          </span>
        </div>
      </div>
      <FeedList posts={posts} onDeleted={handleDeleted} onViewProfile={onViewProfile} />

      {modal && (
        <UserListModal title={modal.title} users={modal.users} onClose={() => setModal(null)} onSelectUser={onViewProfile} />
      )}
    </div>
  );
}
