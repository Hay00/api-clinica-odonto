const db = require('../services/db');
const { SqlDateToBrl } = require('../utils/dateTransformer');
const helper = require('../utils/helper');

/**
 * Retorna todas os agendamentos
 *
 * @param {Number} page número da página
 * @returns JSON
 */
async function getAll({ page = 1, format }) {
  const offset = helper.getOffset(page, 10);

  const rows = await db.query(
    `SELECT ag.idAgenda,
    cl.nome AS cliente,
    fu.nome AS dentista,
    ag.data,
    ag.hora,
    ta.nome AS tipo,
    ag.concluida AS status
    FROM Agenda ag
    INNER JOIN Funcionario fu ON ag.idFuncionario = fu.idFuncionario
    INNER JOIN Cliente cl ON ag.idCliente = cl.idCliente
    INNER JOIN TipoAgenda ta ON ag.idTipo = ta.idTipo;`
  );
  const result = helper.emptyOrRows(rows);
  const meta = { page };

  if (format) {
    // Formatando para a tabela
    const values = result.map(
      ({ idAgenda, cliente, dentista, data, hora, tipo, status }) => ({
        id: idAgenda,
        cliente,
        dentista,
        data: `${SqlDateToBrl(data)} - ${hora}`,
        tipo,
        status: !!status,
      })
    );
    return { values, meta };
  }
  return { values: result, meta };
}

/**
 * Busca os tipos de agendamentos/consultas
 *
 * @returns {Array}
 */
async function getTypes() {
  const types = await db.query('SELECT * FROM TipoAgenda;');

  return {
    types,
  };
}

/**
 * Adiciona um novo agendamento
 *
 * @param {JSON} props valores
 * @returns JSON
 */
async function add(props) {
  const { idCliente, idFuncionario, idTipo, data, hora, concluida } = props;

  const allParams =
    idCliente &&
    idFuncionario &&
    idTipo &&
    data &&
    hora &&
    concluida !== undefined;

  if (!allParams) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `INSERT INTO Agenda (idCliente, idFuncionario, idTipo, data, hora, concluida) 
    values(?,?,?,?,?,?);`,
    [idCliente, idFuncionario, idTipo, data, hora, concluida]
  );

  const id = result.insertId;

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }
  return { message: 'Error in creating schedule', statusCode: 500 };
}

/**
 * Busca apenas um único agendamento
 * @param {Number} id identificador do agendamento
 * @returns JSON
 */
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

/**
 * Atualiza um agendamento específico
 *
 * @param {JSON} props
 * @returns JSON
 */
async function update(id, props) {
  const { idCliente, idFuncionario, idTipo, data, hora, concluida } = props;

  const allParams =
    idCliente &&
    idFuncionario &&
    idTipo &&
    data &&
    hora &&
    concluida !== undefined;

  if (!allParams) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `UPDATE Agenda SET idCliente=?, idFuncionario=?, idTipo=?, data=?, hora=?, concluida=?
    WHERE idAgenda=?;`,
    [idCliente, idFuncionario, idTipo, data, hora, concluida, id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in updating schedule', statusCode: 404 };
}

/**
 * Remove um agendamento específico
 *
 * @param {Number} id identificador do agendamento
 * @returns JSON
 */
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

/**
 * Busca um cliente agendado
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
    `SELECT ag.idAgenda,
    cl.nome AS cliente,
    fu.nome AS dentista,
    ag.data,
    ag.hora,
    ta.nome AS tipo,
    ag.concluida AS status
    FROM Agenda ag
    INNER JOIN Funcionario fu ON ag.idFuncionario = fu.idFuncionario
    INNER JOIN Cliente cl ON ag.idCliente = cl.idCliente
    INNER JOIN TipoAgenda ta ON ag.idTipo = ta.idTipo
    WHERE cl.nome like ?;`,
    [`%${text}%`]
  );

  const result = helper.emptyOrRows(rows);

  const values = result.map(
    ({ idAgenda, cliente, dentista, data, hora, tipo, status }) => ({
      id: idAgenda,
      cliente,
      dentista,
      data: `${SqlDateToBrl(data)} - ${hora}`,
      tipo,
      status: !!status,
    })
  );

  return {
    values,
  };
}

async function complete(id, props) {
  const { concluida } = props;

  if (concluida === undefined) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `UPDATE Agenda SET concluida=?
    WHERE idAgenda=?;`,
    [concluida, id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in updating schedule', statusCode: 404 };
}

module.exports = {
  add,
  complete,
  find,
  get,
  getAll,
  getTypes,
  remove,
  update,
};
