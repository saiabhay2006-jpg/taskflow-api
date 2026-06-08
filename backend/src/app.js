require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const connectDB = require('./config/db');
const { protect } = require('./middleware/auth.middleware');

const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Welcome route at root
  app.get('/', (req, res) => {
    res.send('Task Manager API is running! 🚀 Visit /api-docs for documentation.');
  });

  // Routes
  app.use('/api/v1/auth', require('./routes/v1/auth.routes'));
  app.use('/api/v1/tasks', protect, require('./routes/v1/task.routes'));

  // Global error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`\n🚀 Server running on port ${PORT}\n📄 Swagger docs: http://localhost:${PORT}/api-docs\n`)
  );
};

startServer();
