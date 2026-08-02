export default function RightPanel() {
  return (
    <aside className="right-panel">
      <div className="panel-box">
        <h3>Welcome to Chirp</h3>
        <p className="muted">A mini social media app built for CodeAlpha Internship — Full Stack Development Task 2.</p>
      </div>
      <div className="panel-box">
        <h3>Quick tips</h3>
        <p className="muted">
          Click <strong>Post</strong> to share what's happening. Like and comment on posts in your feed. Visit your{' '}
          <strong>Profile</strong> to see your own posts and stats.
        </p>
      </div>
    </aside>
  );
}
