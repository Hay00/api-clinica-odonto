const express = require('express');
const router = express.Router();
const reports = require('../models/reports');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/agendamentos', async function (req, res, next) {
  try {
    res.json(await reports.getSchedules(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os agendamentos `, err.message);
    next(err);
  }
});

router.get('/financeiro', async function (req, res, next) {
  try {
    res.json(await reports.getFinancial(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os clientes `, err.message);
    next(err);
  }
});

router.get('/equipamentos', async function (req, res, next) {
  try {
    res.json(await reports.getEquipments(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os equipamentos `, err.message);
    next(err);
  }
});

router.get('/medicamentos', async function (req, res, next) {
  try {
    res.json(await reports.getMedicines(req.query));
  } catch (err) {
    console.error(`Erro ao buscar os medicamentos `, err.message);
    next(err);
  }
});

module.exports = router;
