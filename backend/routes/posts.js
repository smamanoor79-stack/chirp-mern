const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/posts  - create a post
router.post('/', protect, async (req, res) => {
  try {
    const { content, image } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }

    const post = await Post.create({ author: req.userId, content, image: image || '' });
    const populatedPost = await post.populate('author', 'name profilePicture followers');

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/posts  - feed (all posts, newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePicture followers')
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((p) => p._id);
    const counts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => { countMap[c._id.toString()] = c.count; });

    const postsWithCounts = posts.map((p) => ({
      ...p,
      commentsCount: countMap[p._id.toString()] || 0,
    }));

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/posts/user/:userId  - all posts by one user
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name profilePicture followers')
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((p) => p._id);
    const counts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => { countMap[c._id.toString()] = c.count; });

    const postsWithCounts = posts.map((p) => ({
      ...p,
      commentsCount: countMap[p._id.toString()] || 0,
    }));

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/posts/:id  - delete own post
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/posts/:id/like  - like or unlike a post
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
    } else {
      post.likes.push(req.userId);
    }

    await post.save();
    res.json({ likesCount: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/repost', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyReposted = post.reposts.includes(req.userId);

    if (alreadyReposted) {
      post.reposts = post.reposts.filter((id) => id.toString() !== req.userId);
    } else {
      post.reposts.push(req.userId);
    }

    await post.save();
    res.json({ repostsCount: post.reposts.length, reposted: !alreadyReposted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;