const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const serverConfig = require('./config/serverConfig');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'UP' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = serverConfig.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
