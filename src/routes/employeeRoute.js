const express = require('express');
const router = express.Router();
const employee = require('../services/employee');

router.get('/', async function (req, res, next) {
  try {
    res.json(await employee.getAll());
  } catch (err) {
    console.error(`Erro ao buscar os funcionários `, err.message);
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    res.json(await employee.add(req.body));
  } catch (err) {
    console.error(`Erro ao criar o funcionário `, err.message);
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    res.json(await employee.get(req.params.id));
  } catch (err) {
    console.error(`Erro ao buscar o funcionário `, err.message);
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    res.json(await employee.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Erro ao atualizar funcionário `, err.message);
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    res.json(await employee.remove(req.params.id));
  } catch (err) {
    console.error(`Erro ao deletar funcionário `, err.message);
    next(err);
  }
});

module.exports = router;
