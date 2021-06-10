const express = require('express');
const router = express.Router();
const schedule = require('../models/schedule');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async function (req, res, next) {
  try {
    res.json(await schedule.getAll(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os agendamentos `, err.message);
    next(err);
  }
});

router.get('/tipos', async function (req, res, next) {
  try {
    res.json(await schedule.getTypes());
  } catch (err) {
    console.error(`Erro ao buscar os tipos de agendamentos `, err.message);
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await schedule.add(req.body);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao criar o agendamento `, err.message);
    next(err);
  }
});

router.get('/buscar', async function (req, res, next) {
  try {
    res.json(await schedule.find(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os agendamentos `, err.message);
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const { message, statusCode, values } = await schedule.get(req.params.id);
    res.status(statusCode).json({ message, values });
  } catch (err) {
    console.error(`Erro ao buscar o agendamento `, err.message);
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await schedule.update(
      req.params.id,
      req.body
    );
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao atualizar agendamento `, err.message);
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await schedule.remove(req.params.id);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao deletar agendamento `, err.message);
    next(err);
  }
});

router.put('/completo/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await schedule.complete(
      req.params.id,
      req.body
    );
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao atualizar agendamento `, err.message);
    next(err);
  }
});

module.exports = router;
