const express = require('express');
const User = require('../models/User');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/me  - current logged-in user's profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('followers', 'name profilePicture')
      .populate('following', 'name profilePicture');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/users/:id  - view any user's profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name profilePicture')
      .populate('following', 'name profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/users/me  - update bio / profile picture
router.put('/me', protect, async (req, res) => {
  try {
    const { bio, profilePicture, name } = req.body;
    const user = await User.findById(req.userId);

    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (name !== undefined) user.name = name;

    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, bio: user.bio, profilePicture: user.profilePicture });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/users/:id/follow  - follow or unfollow a user
router.put('/:id/follow', protect, async (req, res) => {
  try {
    if (req.params.id === req.userId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const isFollowing = targetUser.followers.includes(req.userId);

    if (isFollowing) {
      // unfollow
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== req.userId);
      currentUser.following = currentUser.following.filter((id) => id.toString() !== req.params.id);
    } else {
      // follow
      targetUser.followers.push(req.userId);
      currentUser.following.push(req.params.id);
    }

    await targetUser.save();
    await currentUser.save();

    res.json({ following: !isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;