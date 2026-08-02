const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function authHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function handle(res) {
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no body
  }
  if (!res.ok) {
    throw new Error((data && data.message) || 'Something went wrong');
  }
  return data;
}

export const api = {
  // ---------- AUTH ----------
  signup: (payload) =>
    fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }).then(handle),

  login: (payload) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }).then(handle),

  // ---------- USERS ----------
  getMe: (token) => fetch(`${API_URL}/users/me`, { headers: authHeaders(token) }).then(handle),

  getUser: (id) => fetch(`${API_URL}/users/${id}`).then(handle),

  updateMe: (token, payload) =>
    fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    }).then(handle),

  toggleFollow: (token, userId) =>
    fetch(`${API_URL}/users/${userId}/follow`, {
      method: 'PUT',
      headers: authHeaders(token),
    }).then(handle),

  // ---------- POSTS ----------
  getFeed: () => fetch(`${API_URL}/posts`).then(handle),

  getUserPosts: (userId) => fetch(`${API_URL}/posts/user/${userId}`).then(handle),

  createPost: (token, payload) =>
    fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    }).then(handle),

  deletePost: (token, postId) =>
    fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }).then(handle),

  toggleLike: (token, postId) =>
    fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'PUT',
      headers: authHeaders(token),
    }).then(handle),

  toggleRepost: (token, postId) =>
    fetch(`${API_URL}/posts/${postId}/repost`, {
      method: 'PUT',
      headers: authHeaders(token),
    }).then(handle),

  // ---------- COMMENTS ----------
  getComments: (postId) => fetch(`${API_URL}/comments/${postId}`).then(handle),

  addComment: (token, postId, content) =>
    fetch(`${API_URL}/comments/${postId}`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ content }),
    }).then(handle),
};