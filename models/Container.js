const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

containerSchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Container', containerSchema);
