const express = require('express');
const router = express.Router();
const financial = require('../models/financial');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async function (req, res, next) {
  try {
    res.json(await financial.getAll(req.query));
  } catch (err) {
    console.error(`Erro ao buscar as finanças `, err.message);
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await financial.add(req.body);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao criar uma finança `, err.message);
    next(err);
  }
});

router.get('/buscar', async function (req, res, next) {
  try {
    res.json(await financial.find(req.query));
  } catch (err) {
    console.error(`Erro ao buscar as finanças `, err.message);
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const { message, statusCode, values } = await financial.get(req.params.id);
    res.status(statusCode).json({ message, values });
  } catch (err) {
    console.error(`Erro ao buscar uma finança `, err.message);
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await financial.update(
      req.params.id,
      req.body
    );
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao atualizar a finança `, err.message);
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await financial.remove(req.params.id);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao deletar uma finança `, err.message);
    next(err);
  }
});

module.exports = router;
