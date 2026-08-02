import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Avatar from './Avatar';

export default function PostComposer({ onPosted, textareaRef }) {
  const { token, user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const el = textareaRef?.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [content, textareaRef]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image smaller than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handlePost() {
    const trimmed = content.trim();
    if (!trimmed && !image) return;
    setIsPosting(true);
    try {
      await api.createPost(token, { content: trimmed, image });
      setContent('');
      removeImage();
      onPosted();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div className="compose-box">
      <div className="compose-row">
        <Avatar name={user?.name} picture={user?.profilePicture} />
        <div className="compose-input-wrap">
          <textarea
            ref={textareaRef}
            maxLength={280}
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {image && (
            <div id="image-preview-wrap">
              <img id="image-preview" src={image} alt="" />
              <button className="remove-image-btn" onClick={removeImage}>
                ✕
              </button>
            </div>
          )}
          <div className="compose-footer">
            <div className="compose-footer-left">
              <label className="image-upload-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                </svg>
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageChange} />
              </label>
            </div>
            <div className="compose-footer-right">
              <span>{280 - content.length}</span>
              <button className="primary-btn small" onClick={handlePost} disabled={isPosting}>
                {isPosting ? <span className="spinner"></span> : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}