const db = require('../services/db');
const { SqlDateToBrl } = require('../utils/dateTransformer');
const helper = require('../utils/helper');

/**
 * Retorna todos os clientes
 *
 * @param {Number} page número da página
 * @returns JSON
 */
async function getAll({ page = 1, format }) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query('SELECT * FROM Cliente;');
  const result = helper.emptyOrRows(rows);
  const meta = { page };

  // Formatando para tabela
  if (format) {
    const values = result.map(
      ({ idCliente, nome, cpf, dataNascimento, sexo }) => ({
        id: idCliente,
        nome,
        cpf,
        dataNascimento: SqlDateToBrl(dataNascimento),
        sexo,
      })
    );
    return { values, meta };
  }
  return { values: result, meta };
}

/**
 * Adiciona um novo cliente
 *
 * @param {JSON} props valores
 * @returns JSON
 */
async function add({ nome, cpf, dataNascimento, sexo }) {
  if (!(nome && cpf && dataNascimento && sexo)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `INSERT INTO Cliente
    (nome,cpf,dataNascimento,sexo) 
    values
    (?,?,?,?);`,
    [nome, cpf, dataNascimento, sexo]
  );

  const id = result.insertId;

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }
  return { message: 'Error in creating client', statusCode: 500 };
}

/**
 * Busca apenas um único cliente
 *
 * @param {Number} id identificador do cliente
 * @returns JSON
 */
async function get(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `SELECT * FROM Cliente 
    WHERE idCliente=?;`,
    [id]
  );

  if (result[0]) {
    return { values: result[0], statusCode: 200 };
  }

  return { message: 'Client not found', statusCode: 404 };
}

/**
 * Atualiza um cliente específico
 *
 * @param {JSON} props conteúdo
 * @returns JSON
 */
async function update(id, { nome, cpf, dataNascimento, sexo }) {
  if (!(id && nome && cpf && dataNascimento && sexo)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `UPDATE Cliente SET nome=?, cpf=?, dataNascimento=?, sexo=? 
    WHERE idCliente=?;`,
    [nome, cpf, dataNascimento, sexo, id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in updating client', statusCode: 404 };
}

/**
 * Remove um cliente específico
 *
 * @param {Number} id identificador do cliente
 * @returns JSON
 */
async function remove(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(`DELETE FROM Cliente WHERE idCliente=?`, [id]);

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in removing client', statusCode: 404 };
}

/**
 * Busca um cliente
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
    `SELECT * FROM Cliente
    WHERE nome like ? order by nome;`,
    [`%${text}%`]
  );

  const result = helper.emptyOrRows(rows);

  const values = result.map(
    ({ idCliente, nome, cpf, dataNascimento, sexo }) => ({
      id: idCliente,
      nome,
      cpf,
      dataNascimento: SqlDateToBrl(dataNascimento),
      sexo,
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
