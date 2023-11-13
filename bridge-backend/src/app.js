const express = require('express');
const app = express();

// Parse JSON bodies for this app. Make sure you put this line before your routes!
app.use(express.json());

// Define a simple route for GET requests to the root URL
app.get('/', (req, res) => {
  res.send('Hello World from Bridge!');
});

// Listen on the specified port, default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
