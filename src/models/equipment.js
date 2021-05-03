const db = require('../services/db');
const helper = require('../utils/helper');

/**
 * Retorna todas os equipamentos
 *
 * @param {Integer} page número da página
 * @returns {JSON}
 */
async function getAll(page = 1) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query('SELECT * FROM Equipamentos order by nome;');
  const values = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    values,
    meta,
  };
}

/**
 * Adiciona um novo equipamento
 *
 * @param {JSON} props valores
 * @returns {JSON}
 */
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

/**
 * Busca apenas um único equipamento
 * @param {Number} id identificador do equipamento
 * @returns {JSON}
 */
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

/**
 * Atualiza um equipamento específico
 *
 * @param {JSON} props
 * @returns {JSON}
 */
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

/**
 * Remove um equipamento específico
 *
 * @param {Number} id identificador do equipamento
 * @returns {JSON}
 */
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

/**
 * Busca um equipamento
 *
 * @param {JSON} props args passado por HTTP
 * @returns
 */
async function find(props) {
  const { text } = props;
  if (!text) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const rows = await db.query(
    `SELECT * FROM Equipamentos
    WHERE nome like ? order by nome;`,
    [`%${text}%`]
  );

  const values = helper.emptyOrRows(rows);
  return {
    values,
  };
}

module.exports = {
  add,
  find,
  get,
  getAll,
  remove,
  update,
};
