import { useEffect, useState } from 'react';
import { api } from '../api/client';
import PostComposer from './PostComposer';
import FeedList from './FeedList';

export default function HomeView({ onViewProfile, textareaRef }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadFeed() {
    setLoading(true);
    try {
      const data = await api.getFeed();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  function handleDeleted(postId) {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  }

  return (
    <div>
      <PostComposer onPosted={loadFeed} textareaRef={textareaRef} />
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 0',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(255, 255, 255, 0.15)',
            borderTopColor: '#1d9bf0',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <FeedList posts={posts} onDeleted={handleDeleted} onViewProfile={onViewProfile} />
      )}
    </div>
  );
}