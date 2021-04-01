const express = require('express');
const router = express.Router();
const medicine = require('../services/medicine');

router.get('/', async function (req, res, next) {
  try {
    res.json(await medicine.getAll());
  } catch (err) {
    console.error(`Erro ao buscar os medicamentos `, err.message);
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    res.json(await medicine.add(req.body));
  } catch (err) {
    console.error(`Erro ao criar o medicamento `, err.message);
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    res.json(await medicine.get(req.params.id));
  } catch (err) {
    console.error(`Erro ao buscar o medicamento `, err.message);
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    res.json(await medicine.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Erro ao atualizar medicamento `, err.message);
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    res.json(await medicine.remove(req.params.id));
  } catch (err) {
    console.error(`Erro ao deletar medicamento `, err.message);
    next(err);
  }
});

module.exports = router;
