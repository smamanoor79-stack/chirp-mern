const path = require('path');

// Serve frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all: any non-API route serves the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});