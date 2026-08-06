// ============================================
// Legacy Auth Routes (v1.4 compatibility)
// ============================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');
const UserModel = require('../../models/user.model');

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = UserModel.findByUsername(username);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user.id, username: user.username }, config.jwt.secret, { expiresIn: '24h' });
    res.json({ success: true, token });
  } catch (err) { next(err); }
});

module.exports = router;
