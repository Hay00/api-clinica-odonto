const db = require('../services/db');
const { SqlDateToBrl } = require('../utils/dateTransformer');
const helper = require('../utils/helper');

/**
 * Retorna todas as finanças
 *
 * @param {Number} page número da página
 * @returns JSON
 */
async function getAll({ page = 1, format }) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query('SELECT * FROM Financeiro order by data;');
  const result = helper.emptyOrRows(rows);
  const meta = { page };

  // Formatando para tabela
  if (format) {
    const values = result.map(
      ({ idTransacao, contato, data, descricao, tipo, situacao, valor }) => ({
        id: idTransacao,
        contato,
        data: SqlDateToBrl(data),
        tipo,
        descricao,
        situacao: !!situacao,
        valor: `R$ ${valor}`,
      })
    );
    return { values, meta };
  }
  return { values: result, meta };
}

/**
 * Adiciona uma nova finança
 *
 * @param {JSON} props valores
 * @returns JSON
 */
async function add(props) {
  const { data, descricao, tipo, situacao, valor, contato } = props;

  const allParams =
    data && descricao && tipo && situacao !== undefined && valor && contato;

  if (!allParams) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `INSERT INTO Financeiro (data, descricao, tipo, situacao, valor, contato) 
    values(?,?,?,?,?,?);`,
    [data, descricao, tipo, situacao, valor, contato]
  );

  const id = result.insertId;

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }
  return { message: 'Error in creating finance', statusCode: 500 };
}

/**
 * Busca apenas uma única finança
 *
 * @param {Number} id identificador da finança
 * @returns JSON
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
 * @param {JSON} props conteúdo
 * @returns JSON
 */
async function update(id, props) {
  const { data, descricao, tipo, situacao, valor, contato } = props;

  const allParams =
    data && descricao && tipo && situacao !== undefined && valor && contato;

  if (!allParams) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `UPDATE Financeiro SET data=?, descricao=?, tipo=?, situacao=?, valor=?, contato=?
    WHERE idTransacao=?;`,
    [data, descricao, tipo, situacao, valor, contato, id]
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
 * @returns JSON
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
 * @returns JSON
 */
async function find(props) {
  const { text } = props;
  if (!text) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const rows = await db.query(
    `SELECT * FROM Financeiro
    WHERE contato like ? order by data;`,
    [`%${text}%`]
  );

  const result = helper.emptyOrRows(rows);

  const values = result.map(
    ({ idTransacao, contato, data, descricao, tipo, situacao, valor }) => ({
      id: idTransacao,
      contato,
      data: SqlDateToBrl(data),
      tipo,
      descricao,
      situacao: !!situacao,
      valor: `R$ ${valor}`,
    })
  );

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
