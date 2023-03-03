const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredReply = require('../../Domains/replies/entities/RegisteredReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(registerReply) {
    const {
      content, owner, threadId, commentId,
    } = registerReply;
    const id = `reply-${this._idGenerator()}`;

    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies(id, content, date, user_id, thread_id, comment_id, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, FALSE) RETURNING id, content, user_id as owner',
      values: [id, content, date, owner, threadId, commentId],
    };

    const result = await this._pool.query(query);

    return new RegisteredReply({ ...result.rows[0] });
  }

  async verifyAvailableReply(reply) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [reply],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyOwnerReply(reply, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND user_id = $2',
      values: [reply, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('tidak punya hak untuk melakukan ini');
    }
  }

  async deleteReply(registerReply) {
    const query = {
      text: 'UPDATE replies SET is_deleted=TRUE where id = $1',
      values: [registerReply],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
