import PostCard from './PostCard';

export default function FeedList({ posts, onDeleted, onViewProfile }) {
  if (!posts.length) {
    return <div className="empty-state">No posts yet. Be the first to post!</div>;
  }
  return (
    <div className="feed">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDeleted={onDeleted} onViewProfile={onViewProfile} />
      ))}
    </div>
  );
}
