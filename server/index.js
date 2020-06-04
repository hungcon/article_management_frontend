const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'build', 'index.html')));

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
