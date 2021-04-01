const db = require('./db');
const helper = require('../helper');

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
  const result = await db.query(
    `INSERT INTO Agenda (idCliente, data, hora, concluida) 
    values(?,?,?,?);`,
    [idCliente, data, hora, concluida]
  );

  let message = 'Error in creating user';

  if (result.affectedRows) {
    message = 'User created successfully';
  }
  return { message };
}

async function get(id) {
  const result = await db.query(
    `SELECT * FROM Agenda 
    WHERE idAgenda=?;`,
    [id]
  );
  let message = 'Error in finding user';
  if (result[0]) {
    message = 'User found successfully';
  }

  return result[0];
}

async function update(id, { idCliente, data, hora, concluida }) {
  const result = await db.query(
    `UPDATE Agenda SET idCliente=?, data=?, hora=?, concluida=?
    WHERE idAgenda=?;`,
    [idCliente, data, hora, concluida, id]
  );
  let message = 'Error in updating user';

  if (result.affectedRows) {
    message = 'User updated successfully';
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(`DELETE FROM Agenda WHERE idAgenda=?`, [
    id,
  ]);

  let message = 'Error in deleting user';

  if (result.affectedRows) {
    message = 'User deleted successfully';
  }

  return { message };
}

module.exports = {
  add,
  get,
  getAll,
  remove,
  update,
};
