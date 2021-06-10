const express = require('express');
const router = express.Router();
const medicine = require('../models/medicine');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async function (req, res, next) {
  try {
    res.json(await medicine.getAll(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os medicamentos `, err.message);
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await medicine.add(req.body);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao criar o medicamento `, err.message);
    next(err);
  }
});

router.get('/buscar', async function (req, res, next) {
  try {
    res.json(await medicine.find(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os medicamentos `, err.message);
    next(err);
  }
});


router.get('/:id', async function (req, res, next) {
  try {
    const { message, statusCode, values } = await medicine.get(req.params.id);
    res.status(statusCode).json({ message, values });
  } catch (err) {
    console.error(`Erro ao buscar o medicamento `, err.message);
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await medicine.update(
      req.params.id,
      req.body
    );
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao atualizar medicamento `, err.message);
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const { id, message, statusCode } = await medicine.remove(req.params.id);
    res.status(statusCode).json({ id, message });
  } catch (err) {
    console.error(`Erro ao deletar medicamento `, err.message);
    next(err);
  }
});

module.exports = router;
