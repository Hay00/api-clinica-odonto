const express = require('express');
const router = express.Router();
const client = require('../models/client');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async function (req, res, next) {
  try {
    res.json(await client.getAll(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os clientes `, err.message);
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await client.add(req.body);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao criar o usuário `, err.message);
    next(err);
  }
});

router.get('/buscar', async function (req, res, next) {
  try {
    res.json(await client.find(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os usuários `, err.message);
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const { message, statusCode, values } = await client.get(req.params.id);
    res.status(statusCode).json({ message, values });
  } catch (err) {
    console.error(`Erro ao buscar o usuário `, err.message);
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await client.update(
      req.params.id,
      req.body
    );
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao atualizar o usuário `, err.message);
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await client.remove(req.params.id);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao deletar o usuário `, err.message);
    next(err);
  }
});

module.exports = router;
