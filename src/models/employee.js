const db = require('../services/db');
const jwt = require('jsonwebtoken');
const helper = require('../utils/helper');
const authConfig = require('../config/auth.json');
const { SqlDateToBrl } = require('../utils/dateTransformer');

/**
 * Gera um token que expira em 1 dia
 * @param {Object} params id para identificar o token
 * @returns um token único
 */
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, { expiresIn: '7d' });
}

/**
 * Autentica um usuário que está fazendo login
 * @param {Object} login cpf do funcionário
 * @param {Object} senha senha do funcionário
 * @returns resultado da autenticação
 */
async function authenticate({ login, senha }) {
  if (!(login && senha)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const user = await db.query(
    `SELECT cpf as id, nome FROM Funcionario WHERE cpf=?;`,
    [login]
  );

  if (!user[0]) {
    return { message: 'User not found!', statusCode: 400 };
  }

  const password = await db.query(
    `SELECT null FROM Funcionario WHERE cpf=? AND senha=?;`,
    [login, senha]
  );

  if (!password[0]) {
    return { message: 'Invalid password!', statusCode: 400 };
  }

  const { id, nome } = user[0];

  return { statusCode: 200, user: nome, token: generateToken({ id }) };
}

/**
 * Retorna todos os funcionários
 *
 * @param {Number} page número da página
 * @returns JSON
 */
async function getAll({ page = 1, format }) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query(
    `SELECT idFuncionario, nome, cpf, dataNascimento, sexo 
    FROM Funcionario;`
  );
  const result = helper.emptyOrRows(rows);
  const meta = { page };

  // Formatando para tabela
  if (format) {
    const values = result.map(
      ({ idFuncionario, nome, cpf, dataNascimento, sexo }) => ({
        id: idFuncionario,
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

async function getDentist() {
  const values = await db.query('SELECT * FROM Funcionario;');

  return {
    values,
  };
}

/**
 * Adiciona um novo funcionário
 *
 * @param {JSON} props valores
 * @returns JSON
 */
async function add({ nome, cpf, dataNascimento, sexo, senha }) {
  if (!(nome && cpf && dataNascimento && sexo && senha)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `INSERT INTO Funcionario
    (nome,cpf,dataNascimento,sexo,senha) 
    values
    (?,?,?,?,?);`,
    [nome, cpf, dataNascimento, sexo, senha]
  );

  const id = result.insertId;

  if (result.affectedRows) {
    return { id, statusCode: 200, token: generateToken({ cpf }) };
  }

  return { message: 'Error in creating employee', statusCode: 500 };
}

/**
 * Busca apenas um único funcionário
 *
 * @param {Number} id identificador do funcionário
 * @returns JSON
 */
async function get(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `SELECT idFuncionario, nome, cpf, dataNascimento, sexo 
    FROM Funcionario 
    WHERE idFuncionario=?;`,
    [id]
  );

  if (result[0]) {
    return { values: result[0], statusCode: 200 };
  }

  return { message: 'Employee not found', statusCode: 404 };
}

/**
 * Atualiza um funcionário específico
 *
 * @param {JSON} props conteúdo
 * @returns JSON
 */
async function update(id, props) {
  const { nome, cpf, dataNascimento, sexo, senha, novaSenha } = props;
  if (!(id && nome && cpf && dataNascimento && sexo && senha)) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  let result;
  if (novaSenha) {
    result = await db.query(
      `UPDATE Funcionario 
      SET nome=?, cpf=?, dataNascimento=?, sexo=?, senha=? 
      WHERE idFuncionario=? AND senha=?;`,
      [nome, cpf, dataNascimento, sexo, novaSenha, id, senha]
    );
  } else {
    result = await db.query(
      `UPDATE Funcionario 
      SET nome=?, cpf=?, dataNascimento=?, sexo=?
      WHERE idFuncionario=? AND senha=?;`,
      [nome, cpf, dataNascimento, sexo, id, senha]
    );
  }

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in updating employee', statusCode: 404 };
}

/**
 * Remove um funcionário específico
 *
 * @param {Number} id identificador do funcionário
 * @returns JSON
 */
async function remove(id) {
  if (!id) {
    return { message: 'Bad Request, malformed syntax', statusCode: 400 };
  }

  const result = await db.query(
    `DELETE FROM Funcionario WHERE idFuncionario=?`,
    [id]
  );

  if (result.affectedRows) {
    return { id, statusCode: 200 };
  }

  return { message: 'Error in removing employee', statusCode: 404 };
}

/**
 * Busca um Funcionário
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
    `SELECT * FROM Funcionario
    WHERE nome like ? order by nome;`,
    [`%${text}%`]
  );

  const result = helper.emptyOrRows(rows);

  const values = result.map(
    ({ idFuncionario, nome, cpf, dataNascimento, sexo }) => ({
      id: idFuncionario,
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
  authenticate,
  add,
  find,
  get,
  getAll,
  getDentist,
  remove,
  update,
};
