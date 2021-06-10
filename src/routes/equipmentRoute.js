const express = require('express');
const router = express.Router();
const equipment = require('../models/equipment');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async function (req, res, next) {
  try {
    res.json(await equipment.getAll(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os equipamentos `, err.message);
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await equipment.add(req.body);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao criar o equipamento `, err.message);
    next(err);
  }
});

router.get('/buscar', async function (req, res, next) {
  try {
    res.json(await equipment.find(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os equipamentos `, err.message);
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const { message, statusCode, values } = await equipment.get(req.params.id);
    res.status(statusCode).json({ message, values });
  } catch (err) {
    console.error(`Erro ao buscar o equipamento `, err.message);
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await equipment.update(
      req.params.id,
      req.body
    );
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao atualizar equipamento `, err.message);
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await equipment.remove(req.params.id);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao deletar equipamento `, err.message);
    next(err);
  }
});

module.exports = router;
