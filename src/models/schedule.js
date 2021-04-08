const db = require('../services/db');
const helper = require('../utils/helper');

async function getAll(page = 1) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query('SELECT * FROM Agenda;');
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function add({ idCliente, data, hora, concluida }) {
  if (!(idCliente && data && hora && concluida !== undefined)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `INSERT INTO Agenda (idCliente, data, hora, concluida) 
    values(?,?,?,?);`,
    [idCliente, data, hora, concluida]
  );

  const id = result.insertId;

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }
  return { message: 'Error in creating schedule', statusCode: 500 };
}

async function get(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `SELECT * FROM Agenda 
    WHERE idAgenda=?;`,
    [id]
  );

  if (result[0]) {
    return { values: result[0], statusCode: 200 };
  }

  return { message: 'Schedule not found', statusCode: 404 };
}

async function update(id, { idCliente, data, hora, concluida }) {
  if (!(id && idCliente && data && hora && concluida !== undefined)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `UPDATE Agenda SET idCliente=?, data=?, hora=?, concluida=?
    WHERE idAgenda=?;`,
    [idCliente, data, hora, concluida, id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in updating schedule', statusCode: 404 };
}

async function remove(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(`DELETE FROM Agenda WHERE idAgenda=?`, [id]);

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in removing schedule', statusCode: 404 };
}

module.exports = {
  add,
  get,
  getAll,
  remove,
  update,
};
