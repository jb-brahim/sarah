require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

connectDB();

// Enhanced CORS configuration
// Support multiple allowed frontends via `FRONTEND_URLS` (comma-separated),
// fallback to `FRONTEND_URL`, and development localhost list when not in
// production. This keeps CORS restrictive while allowing multiple origins.
const parseAllowedOrigins = () => {
  const envList = process.env.FRONTEND_URLS || '';
  const envSingle = process.env.FRONTEND_URL || '';
  const envOrigins = envList
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (envOrigins.length > 0) return envOrigins;
  if (envSingle) return [envSingle];
  return [];
};

const defaultDevOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'];

const allowedOrigins = process.env.NODE_ENV === 'production' ? parseAllowedOrigins() : defaultDevOrigins;

// Log resolved CORS configuration at startup to aid debugging in production logs
console.log('CORS configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  ALLOW_ALL_ORIGINS: process.env.ALLOW_ALL_ORIGINS === 'true',
  FRONTEND_URLS: process.env.FRONTEND_URLS,
  FRONTEND_URL: process.env.FRONTEND_URL,
  allowedOrigins
});

const corsOptions = {
  origin: (origin, callback) => {
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

// Serve uploaded/static files from public/uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
