const db = require('./db');

async function authenticate({ login, senha }) {
  const result = await db.query(
    `SELECT {senha} FROM Cliente 
        WHERE login=?;`,
    [login]
  );
}

module.exports = {
  authenticate,
};
