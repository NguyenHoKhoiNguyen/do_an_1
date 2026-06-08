const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const buildPath = path.join(__dirname, 'build-run');

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend static server is running at http://localhost:${port}`);
});
