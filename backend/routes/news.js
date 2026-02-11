const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

router.get('/', (req, res) => res.json(store.news));

router.get('/:id', (req, res) => {
  const item = store.news.find(n => n.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/', (req, res) => {
  const { title, content, category, status = 'published' } = req.body;
  const item = {
    id: uuidv4(),
    title,
    content,
    category,
    status,
    views: 0,
    viewsHistory: [],
    createdAt: new Date().toISOString(),
  };
  store.news.push(item);
  res.status(201).json(item);
});

router.put('/:id', (req, res) => {
  const idx = store.news.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  store.news[idx] = { ...store.news[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(store.news[idx]);
});

router.delete('/:id', (req, res) => {
  const idx = store.news.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = store.news.splice(idx, 1)[0];
  res.json(removed);
});

// Increment view for a news item (records timestamp)
router.post('/:id/view', (req, res) => {
  const idx = store.news.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const item = store.news[idx];
  item.views = (item.views || 0) + 1;
  item.viewsHistory = item.viewsHistory || [];
  item.viewsHistory.push(new Date().toISOString());
  res.json({ id: item.id, views: item.views, viewsHistory: item.viewsHistory });
});

module.exports = router;
