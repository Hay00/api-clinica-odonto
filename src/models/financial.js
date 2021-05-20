const db = require('../services/db');
const helper = require('../utils/helper');

/**
 * Retorna todas as finanças
 *
 * @param {Integer} page número da página
 * @returns {JSON}
 */
async function getAll(page = 1) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query('SELECT * FROM Financeiro order by data;');
  const values = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    values,
    meta,
  };
}

/**
 * Adiciona uma nova finança
 *
 * @param {JSON} props valores
 * @returns {JSON}
 */
async function add(props) {
  const { data, descricao, situacao, valor, devedor } = props;
  if (!(data && descricao && situacao && valor && devedor)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `INSERT INTO Financeiro (data, descricao, situacao, valor, devedor) 
    values(?,?,?,?,?);`,
    [data, descricao, situacao, valor, devedor]
  );

  const id = result.insertId;

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }
  return { message: 'Error in creating finance', statusCode: 500 };
}

/**
 * Busca apenas uma única finança
 * @param {Number} id identificador da finança
 * @returns {JSON}
 */
async function get(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `SELECT * FROM Financeiro 
    WHERE idTransacao=?;`,
    [id]
  );

  if (result[0]) {
    return { values: result[0], statusCode: 200 };
  }

  return { message: 'Finance not found', statusCode: 404 };
}

/**
 * Atualiza uma finança específica
 *
 * @param {JSON} props
 * @returns {JSON}
 */
async function update(id, props) {
  const { data, descricao, situacao, valor, devedor } = props;
  if (!(data && descricao && situacao && valor && devedor)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `UPDATE Financeiro SET data=?, descricao=?, situacao=?, valor=?, devedor=?
    WHERE idTransacao=?;`,
    [data, descricao, situacao, valor, devedor, id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in updating finance', statusCode: 404 };
}

/**
 * Remove um finança específica
 *
 * @param {Number} id identificador da finança
 * @returns {JSON}
 */
async function remove(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(`DELETE FROM Financeiro WHERE idTransacao=?`, [
    id,
  ]);

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in removing finance', statusCode: 404 };
}

/**
 * Busca um finança
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
    `SELECT * FROM Financeiro
    WHERE devedor like ? order by data;`,
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
