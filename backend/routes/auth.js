const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  let user = store.users.find(u => u.email === email);
  if (!user) {
    user = { id: uuidv4(), email, password };
    store.users.push(user);
  }
  const token = uuidv4();
  store.sessions[token] = user.id;
  res.json({ token, user: { id: user.id, email: user.email } });
});

router.post('/logout', (req, res) => {
  const { token } = req.body;
  if (token && store.sessions[token]) delete store.sessions[token];
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.replace('Bearer ', '');
  const userId = store.sessions[token];
  if (!userId) return res.status(401).json({ error: 'Invalid token' });
  const user = store.users.find(u => u.id === userId);
  res.json({ user: { id: user.id, email: user.email } });
});

module.exports = router;
