const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  // Map tasks to return all relevant fields for the frontend
  const tasksWithFrontendFields = tasks.map(task => ({
    _id: task._id,
    userId: task.userId,
    nome: task.titulo, // Map 'titulo' to 'nome' for frontend compatibility
    prazo: task.dataLimite, // Map 'dataLimite' to 'prazo'
    concluida: task.status === 'concluida',
    descricao: task.descricao,
    repetirDiariamente: task.repetirDiariamente,
    notificada: task.notificada
  }));
  res.json(tasksWithFrontendFields);
});

router.post('/', async (req, res) => {
  // Map 'nome' from frontend to 'titulo' in backend
  const { nome, prazo, ...rest } = req.body;
  const novaTask = new Task({
    titulo: nome, // store as 'titulo' in DB
    dataLimite: prazo, // store as 'dataLimite' in DB
    ...rest,
    userId: req.user.id
  });
  await novaTask.save();
  // Respond with mapped fields for frontend compatibility
  res.status(201).json({
    _id: novaTask._id,
    userId: novaTask.userId,
    nome: novaTask.titulo,
    prazo: novaTask.dataLimite,
    concluida: novaTask.status === 'concluida',
    descricao: novaTask.descricao,
    repetirDiariamente: novaTask.repetirDiariamente,
    notificada: novaTask.notificada
  });
});

router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.status(204).end();
});

module.exports = router;
