module.exports = {
  users: [],
  sessions: {},
  news: [
    {
      id: '1',
      title: 'Welcome to News Dashboard',
      content: 'This is the initial news item stored in the in-memory backend.',
      category: null,
      status: 'published',
      views: 0,
      viewsHistory: [],
      createdAt: new Date().toISOString()
    }
  ],
  categories: [
    { id: 'c1', name: 'General' }
  ]
};
