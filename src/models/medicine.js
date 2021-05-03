const db = require('../services/db');
const helper = require('../utils/helper');

async function getAll(page = 1) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query('SELECT * FROM Medicamentos;');
  const values = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    values,
    meta,
  };
}

async function add({ nome, unidades, valor }) {
  if (!(nome && unidades && valor)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }
  const result = await db.query(
    `INSERT INTO Medicamentos (nome, unidades, valor) 
    values(?,?,?);`,
    [nome, unidades, valor]
  );

  const id = result.insertId;

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }
  return { message: 'Error in creating medicine', statusCode: 500 };
}

async function get(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `SELECT * FROM Medicamentos 
    WHERE idMedicamento=?;`,
    [id]
  );

  if (result[0]) {
    return { values: result[0], statusCode: 200 };
  }

  return { message: 'Medicine not found', statusCode: 404 };
}

async function update(id, { nome, unidades, valor }) {
  if (!(id && nome && unidades && valor)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `UPDATE Medicamentos SET nome=?, unidades=?, valor=?
    WHERE idMedicamento=?;`,
    [nome, unidades, valor, id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in updating medicine', statusCode: 404 };
}

async function remove(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `DELETE FROM Medicamentos WHERE idMedicamento=?`,
    [id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in removing medicine', statusCode: 404 };
}

module.exports = {
  add,
  get,
  getAll,
  remove,
  update,
};
