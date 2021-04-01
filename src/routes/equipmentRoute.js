const express = require('express');
const router = express.Router();
const equipment = require('../services/equipment');

router.get('/', async function (req, res, next) {
  try {
    res.json(await equipment.getAll());
  } catch (err) {
    console.error(`Erro ao buscar os equipamentos `, err.message);
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    res.json(await equipment.add(req.body));
  } catch (err) {
    console.error(`Erro ao criar o equipamento `, err.message);
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    res.json(await equipment.get(req.params.id));
  } catch (err) {
    console.error(`Erro ao buscar o equipamento `, err.message);
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    res.json(await equipment.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Erro ao atualizar equipamento `, err.message);
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    res.json(await equipment.remove(req.params.id));
  } catch (err) {
    console.error(`Erro ao deletar equipamento `, err.message);
    next(err);
  }
});

module.exports = router;
