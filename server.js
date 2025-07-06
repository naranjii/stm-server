
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const containerRoutes = require('./routes/containerRoutes');
const { authenticateToken } = require('./middlewares/authMiddleware');
require('dotenv').config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/containers', authenticateToken, containerRoutes);

// MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('🟢 MongoDB conectado');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('Erro na conexão com MongoDB:', err));
