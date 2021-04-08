const db = require('../services/db');
const helper = require('../utils/helper');

async function getAll(page = 1) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query('SELECT * FROM Equipamentos;');
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function add({ nome, unidades }) {
  if (!(nome && unidades)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `INSERT INTO Equipamentos (nome, unidades) 
    values(?,?);`,
    [nome, unidades]
  );

  const id = result.insertId;

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }
  return { message: 'Error in creating equipment', statusCode: 500 };
}

async function get(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `SELECT * FROM Equipamentos 
    WHERE idEquipamento=?;`,
    [id]
  );

  if (result[0]) {
    return { values: result[0], statusCode: 200 };
  }

  return { message: 'Equipment not found', statusCode: 404 };
}

async function update(id, { nome, unidades }) {
  if (!(id && nome && unidades)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `UPDATE Equipamentos SET nome=?, unidades=?
    WHERE idEquipamento=?;`,
    [nome, unidades, id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in updating equipment', statusCode: 404 };
}

async function remove(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `DELETE FROM Equipamentos WHERE idEquipamento=?`,
    [id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in removing equipment', statusCode: 404 };
}

module.exports = {
  add,
  get,
  getAll,
  remove,
  update,
};
