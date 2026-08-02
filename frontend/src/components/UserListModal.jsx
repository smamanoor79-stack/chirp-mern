import Avatar from './Avatar';

export default function UserListModal({ title, users, onClose, onSelectUser }) {
  return (
    <div
      className="user-list-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="user-list-modal">
        <div className="user-list-modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="user-list-modal-body">
          {users && users.length ? (
            users.map((u) => (
              <div
                key={u._id}
                className="user-list-item"
                onClick={() => {
                  onClose();
                  onSelectUser(u._id);
                }}
              >
                <Avatar name={u.name} picture={u.profilePicture} size={36} />
                <span>{u.name}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">No users yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
