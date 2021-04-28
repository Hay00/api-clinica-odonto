const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

// Routes
const clientRoute = require('./src/routes/clientRoute');
const equipmentRoute = require('./src/routes/equipmentRoute');
const employeeRoute = require('./src/routes/employeeRoute');
const medicineRoute = require('./src/routes/medicineRoute');
const scheduleRoute = require('./src/routes/scheduleRoute');

// Parsing body with json
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

// Routing
// app.use('/financeiro', financialRoute);
app.use('/clientes', clientRoute);
app.use('/equipamentos', equipmentRoute);
app.use('/funcionarios', employeeRoute);
app.use('/medicamentos', medicineRoute);
app.use('/agendamentos', scheduleRoute);
// app.use('/relatorios', reportsRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => console.log(`Example app listening on port port!`));
