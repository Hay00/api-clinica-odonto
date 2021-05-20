const db = require('../services/db');
const jwt = require('jsonwebtoken');
const helper = require('../utils/helper');
const authConfig = require('../config/auth.json');

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
    `SELECT cpf as id FROM Funcionario WHERE cpf=?;`,
    [login]
  );

  const password = await db.query(
    `SELECT null FROM Funcionario WHERE cpf=? AND senha=?;`,
    [login, senha]
  );

  if (!user[0]) {
    return { message: 'User not found!', statusCode: 400 };
  }

  if (!password[0]) {
    return { message: 'Invalid password!', statusCode: 400 };
  }

  const { id } = user[0];

  return { message: 'ok', statusCode: 200, token: generateToken({ id }) };
}

/**
 * Busca todos os funcionários
 * @param {Number} page número da página
 * @returns todos os funcionários
 */
async function getAll(page = 1) {
  const offset = helper.getOffset(page, 10);
  const rows = await db.query(
    `SELECT idFuncionario, nome, cpf, dataNascimento, sexo 
    FROM Funcionario;`
  );
  const values = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    values,
    meta,
  };
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
 * @returns um token ou mensagem de erro
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
 * Busca um único funcionário específico
 *
 * @param {Number} id identificador do funcionário
 * @returns resultado da operação
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
 * @param {Number} id identificador do funcionário
 * @returns resultado da operação
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
 * @returns resultado da operação
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
 * @returns
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

  const values = helper.emptyOrRows(rows);
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
