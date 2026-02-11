const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

router.get('/', (req, res) => res.json(store.categories));

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  const cat = { id: uuidv4(), name };
  store.categories.push(cat);
  res.status(201).json(cat);
});

router.delete('/:id', (req, res) => {
  const idx = store.categories.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = store.categories.splice(idx, 1)[0];
  res.json(removed);
});

module.exports = router;
