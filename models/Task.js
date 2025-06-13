const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  titulo: String,
  descricao: String,
  dataLimite: Date,
  repetirDiariamente: Boolean,
  status: { type: String, enum: ['pendente', 'concluida'], default: 'pendente' },
  notificada: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
