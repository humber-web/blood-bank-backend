const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const donorRoutes = require('./routes/donorRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/donors', donorRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).send({ error: 'Not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


require('./notificationScheduler');
