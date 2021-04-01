const express = require('express');
const router = express.Router();
const client = require('../services/client');

router.get('/', async function (req, res, next) {
  try {
    res.json(await client.getAll());
  } catch (err) {
    console.error(`Erro ao buscar os clientes `, err.message);
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    res.json(await client.add(req.body));
  } catch (err) {
    console.error(`Erro ao criar o usuário `, err.message);
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    res.json(await client.get(req.params.id));
  } catch (err) {
    console.error(`Erro ao buscar o usuário `, err.message);
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    res.json(await client.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Erro ao atualizar o usuário `, err.message);
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    res.json(await client.remove(req.params.id));
  } catch (err) {
    console.error(`Erro ao deletar o usuário `, err.message);
    next(err);
  }
});

module.exports = router;
