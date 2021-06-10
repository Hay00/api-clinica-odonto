const db = require('../services/db');
const { SqlDateToBrl } = require('../utils/dateTransformer');
const helper = require('../utils/helper');

/**
 * Busca todos os de acordo com a requisição
 *
 * @param {JSON} props parâmetros
 * @returns JSON
 */
async function getSchedules(props) {
  const { dataInicio, dataFinal } = props;

  if (!(dataInicio && dataFinal)) {
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
    WHERE data BETWEEN ? AND ? 
    AND concluida = TRUE;`,
    [dataInicio, dataFinal]
  );

  const result = helper.emptyOrRows(rows);

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

  return {
    values,
  };
}

/**
 * Busca todos os de acordo com a requisição
 *
 * @param {JSON} props parâmetros
 * @returns JSON
 */
async function getFinancial(props) {
  const { dataInicio, dataFinal } = props;

  if (!(dataInicio && dataFinal)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const rows = await db.query(
    `SELECT * FROM Financeiro
      WHERE data BETWEEN ? AND ?
      AND situacao = TRUE;`,
    [dataInicio, dataFinal]
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

/**
 * Busca equipamentos em falta
 *
 * @param {JSON} props parâmetros
 * @returns JSON
 */
async function getEquipments(props) {
  const rows = await db.query(
    `SELECT * FROM Equipamentos
     ORDER BY unidades;`
  );

  const result = helper.emptyOrRows(rows);

  const values = result.map(({ idEquipamento, nome, unidades }) => ({
    id: idEquipamento,
    nome,
    unidades,
  }));

  return {
    values,
  };
}

/**
 * Busca medicamentos em falta
 *
 * @param {JSON} props parâmetros
 * @returns JSON
 */
async function getMedicines(props) {
  const rows = await db.query(
    `SELECT * FROM Medicamentos
    ORDER BY unidades;`
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
  getSchedules,
  getFinancial,
  getEquipments,
  getMedicines,
};
