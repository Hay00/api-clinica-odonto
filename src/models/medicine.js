const db = require('../services/db');
const helper = require('../utils/helper');

/**
 * Retorna todos os medicamentos
 *
 * @param {Number} page número da página
 * @returns JSON
 */
async function getAll({ page = 1, format }) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query('SELECT * FROM Medicamentos;');
  const result = helper.emptyOrRows(rows);
  const meta = { page };

  if (format) {
    // Formatando para a tabela
    const values = result.map(({ idMedicamento, nome, unidades, valor }) => ({
      id: idMedicamento,
      nome,
      unidades,
      valor: `R$ ${valor}`,
    }));
    return { values, meta };
  }
  return { values: result, meta };
}

/**
 * Adiciona um novo medicamento
 *
 * @param {JSON} props valores
 * @returns JSON
 */
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

/**
 * Busca apenas um único medicamento
 *
 * @param {Number} id identificador do medicamento
 * @returns JSON
 */
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

/**
 * Atualiza um medicamento específico
 *
 * @param {JSON} props conteúdo
 * @returns JSON
 */
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

/**
 * Remove um medicamento específico
 *
 * @param {Number} id identificador do medicamento
 * @returns JSON
 */
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

/**
 * Busca um medicamento
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
    `SELECT * FROM Medicamentos
    WHERE nome like ? order by nome;`,
    [`%${text}%`]
  );

  const result = helper.emptyOrRows(rows);

  const values = result.map(({ idMedicamento, nome, unidades, valor }) => ({
    id: idMedicamento,
    nome,
    unidades,
    valor: `R$ ${valor}`,
  }));

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
