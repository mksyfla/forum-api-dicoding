/* eslint-disable import/order */
/* istanbul ignotre file */
const UsersTableTestHelper = require('./UsersTableTestHelper');
const Jwt = require('@hapi/jwt');
const pool = require('../src/Infrastructures/database/postgres/pool');
const AuthenticationsTableTestHelper = require('./AuthenticationsTableTestHelper');

const ServerTestHelper = {
  async getAccessToken({
    id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia',
  }) {
    await UsersTableTestHelper.addUser({
      id, username, password, fullname,
    });
    const generateAccessToken = Jwt.token.generate({
      id, username, password, fullname,
    }, process.env.ACCESS_TOKEN_KEY);
    const generateRefreshToken = Jwt.token.generate({
      id, username, password, fullname,
    }, process.env.REFRESH_TOKEN_KEY);
    await AuthenticationsTableTestHelper.addToken(generateRefreshToken);

    return generateAccessToken;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM authentications');
  },
};

module.exports = ServerTestHelper;
