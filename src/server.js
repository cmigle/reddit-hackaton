const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'webroot')));
app.use(express.json());

// Start server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});