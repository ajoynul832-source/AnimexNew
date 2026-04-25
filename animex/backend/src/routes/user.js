const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// All user routes require auth
router.use(auth);

// Profile
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Watch History
router.get('/history', userController.getHistory);
router.post('/history', userController.addToHistory);
router.delete('/history/:animeId', userController.removeFromHistory);
router.delete('/history', userController.clearHistory);

// Watchlist
router.get('/watchlist', userController.getWatchlist);
router.post('/watchlist', userController.addToWatchlist);
router.delete('/watchlist/:animeId', userController.removeFromWatchlist);
router.get('/watchlist/check/:animeId', userController.checkWatchlist);

// Auto Next Preference
router.patch(
  '/preferences/auto-next',
  userController.updateAutoNextPreference
);

module.exports = router;
