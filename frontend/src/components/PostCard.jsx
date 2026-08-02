import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { timeAgo, EMOJI_LIST } from '../utils';
import Avatar from './Avatar';

const ICONS = {
  comment:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.39 2.77 6.1 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.747-6.13-6.129-6.13H9.756z"/></svg>',
  retweet:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 3.88l4.43 4.43-1.41 1.41-2.02-2.02V16c0 1.1.9 2 2 2H13v2H7.5c-2.21 0-4-1.79-4-4V7.7L1.48 9.72.07 8.31 4.5 3.88zM16.5 6H11V4h5.5c2.21 0 4 1.79 4 4v8.3l2.02-2.02 1.41 1.41-4.43 4.43-4.43-4.43 1.41-1.41 2.02 2.02V8c0-1.1-.9-2-2-2z"/></svg>',
  likeOutline:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>',
  likeFilled:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
};

function Icon({ name }) {
  return <span className="icon-wrap" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}

export default function PostCard({ post, onDeleted, onViewProfile }) {
  const { token, user } = useAuth();

  const isOwn = post.author._id === user._id;
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(user._id));
  const [repostsCount, setRepostsCount] = useState(post.reposts?.length || 0);
  const [reposted, setReposted] = useState(post.reposts?.includes(user._id) || false);
  const [isFollowing, setIsFollowing] = useState(
    post.author.followers?.some((id) => id.toString() === user._id)
  );
  const [followHover, setFollowHover] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(post.commentsCount || 0);
  const [commentInput, setCommentInput] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);

  async function toggleLike() {
    const data = await api.toggleLike(token, post._id);
    setLiked(data.liked);
    setLikesCount(data.likesCount);
  }

  async function toggleRepost() {
    const data = await api.toggleRepost(token, post._id);
    setReposted(data.reposted);
    setRepostsCount(data.repostsCount);
  }

  async function handleDelete() {
    if (!window.confirm('Delete this post?')) return;
    await api.deletePost(token, post._id);
    onDeleted(post._id);
  }

  async function toggleComments() {
    const opening = !commentsOpen;
    setCommentsOpen(opening);
    if (opening) {
      const data = await api.getComments(post._id);
      setComments(data);
      setCommentCount(data.length);
    }
  }

  async function submitComment() {
    const content = commentInput.trim();
    if (!content) return;
    await api.addComment(token, post._id, content);
    setCommentInput('');
    const data = await api.getComments(post._id);
    setComments(data);
    setCommentCount(data.length);
    setCommentsOpen(true);
  }

  async function handleToggleFollow() {
    try {
      const data = await api.toggleFollow(token, post.author._id);
      setIsFollowing(data.following);
    } catch (err) {
      alert('Could not update follow status');
    }
  }

  return (
    <div className="post-card">
      <Avatar name={post.author.name} picture={post.author.profilePicture} onClick={() => onViewProfile(post.author._id)} />
      <div className="post-body">
        <div className="post-header">
          <div className="post-author-line">
            <span className="author-name" style={{ cursor: 'pointer' }} onClick={() => onViewProfile(post.author._id)}>
              {post.author.name}
            </span>
            <span className="post-time">{timeAgo(post.createdAt)}</span>
            {!isOwn && (
              <button
                className={`follow-btn-small ${isFollowing ? 'following' : ''}`}
                onClick={handleToggleFollow}
                onMouseEnter={() => setFollowHover(true)}
                onMouseLeave={() => setFollowHover(false)}
              >
                {isFollowing ? (followHover ? 'Unfollow' : 'Following') : 'Follow'}
              </button>
            )}
          </div>
          {isOwn && (
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
        <div className="post-content">{post.content}</div>
        {post.image && <img className="post-image" src={post.image} alt="" />}
        <div className="post-actions">
          <button className="action-btn" onClick={toggleComments}>
            <Icon name="comment" /> <span className="comment-count">{commentCount}</span>
          </button>
          <button className={`action-btn repost-btn ${reposted ? 'reposted' : ''}`} onClick={toggleRepost}>
            <Icon name="retweet" /> <span>{repostsCount > 0 ? repostsCount : 'Repost'}</span>
          </button>
          <button className={`action-btn like-btn ${liked ? 'liked' : ''}`} onClick={toggleLike}>
            <Icon name={liked ? 'likeFilled' : 'likeOutline'} /> <span className="like-count">{likesCount}</span>
          </button>
        </div>

        {commentsOpen && (
          <div className="comments-section">
            <div className="comments-list">
              {comments.map((c) => (
                <div className="comment" key={c._id}>
                  <Avatar name={c.author.name} picture={c.author.profilePicture} size={28} />
                  <div>
                    <span className="author-name">{c.author.name}</span>
                    <div>{c.content}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="comment-input-row" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Post your reply"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              />
              <button className="emoji-toggle-btn" onClick={() => setEmojiOpen((v) => !v)}>
                😊
              </button>
              {emojiOpen && (
                <div className="emoji-picker">
                  {EMOJI_LIST.map((e) => (
                    <span
                      key={e}
                      onClick={() => {
                        setCommentInput((v) => v + e);
                        setEmojiOpen(false);
                      }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              )}
              <button onClick={submitComment}>Reply</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}