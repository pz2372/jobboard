const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'You are authorized!', userId: req.userId });
});

module.exports = router;
