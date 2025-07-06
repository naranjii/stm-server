const express = require('express');
const Container = require('../models/Container');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all containers for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const containers = await Container.find({ userId: req.user.id });
    res.json(containers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new container
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Container name is required' });
    }
    const newContainer = new Container({
      name,
      userId: req.user.id,
    });
    await newContainer.save();
    res.status(201).json(newContainer);
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error
      return res.status(409).json({ error: 'Container with this name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Update a container
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Container name is required' });
    }
    const updatedContainer = await Container.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name },
      { new: true, runValidators: true }
    );
    if (!updatedContainer) {
      return res.status(404).json({ error: 'Container not found or not authorized' });
    }
    res.json(updatedContainer);
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error
      return res.status(409).json({ error: 'Container with this name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Delete a container
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedContainer = await Container.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deletedContainer) {
      return res.status(404).json({ error: 'Container not found or not authorized' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
