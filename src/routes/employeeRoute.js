const express = require('express');
const router = express.Router();
const employee = require('../models/employee');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async function (req, res, next) {
  try {
    res.json(await employee.getAll());
  } catch (err) {
    console.error(`Erro ao buscar os funcionários `, err.message);
    next(err);
  }
});

router.get('/dentistas', authMiddleware, async function (req, res, next) {
  try {
    res.json(await employee.getDentist());
  } catch (err) {
    console.error(`Erro ao buscar os dentistas `, err.message);
    next(err);
  }
});

router.post('/', authMiddleware, async function (req, res, next) {
  try {
    const { id, message, statusCode, token } = await employee.add(req.body);
    res.status(statusCode).json({ id, message, token });
  } catch (err) {
    console.error(`Erro ao criar o funcionário `, err.message);
    next(err);
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const { message, statusCode, token } = await employee.authenticate(
      req.body
    );
    res.status(statusCode).json({ message, token });
  } catch (err) {
    console.error(`Error while creating user `, err.message);
    next(err);
  }
});

router.get('/buscar', async function (req, res, next) {
  try {
    res.json(await employee.find(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os funcionários `, err.message);
    next(err);
  }
});

router.get('/:id', authMiddleware, async function (req, res, next) {
  try {
    const { message, statusCode, values } = await employee.get(req.params.id);
    res.status(statusCode).json({ message, values });
  } catch (err) {
    console.error(`Erro ao buscar o funcionário `, err.message);
    next(err);
  }
});

router.put('/:id', authMiddleware, async function (req, res, next) {
  try {
    const { id, message, statusCode } = await employee.update(
      req.params.id,
      req.body
    );
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao atualizar funcionário `, err.message);
    next(err);
  }
});

router.delete('/:id', authMiddleware, async function (req, res, next) {
  try {
    const { id, message, statusCode } = await employee.remove(req.params.id);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao deletar funcionário `, err.message);
    next(err);
  }
});

module.exports = router;
