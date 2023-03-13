const RegisteredComment = require('../../Domains/comments/entities/RegisteredComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(registerComment) {
    const { content, owner, threadId } = registerComment;
    const id = `comment-${this._idGenerator()}`;

    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments(id, content, date, user_id, thread_id, is_deleted) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING id, content, user_id as owner',
      values: [id, content, date, owner, threadId],
    };

    const result = await this._pool.query(query);

    return new RegisteredComment(result.rows[0]);
  }

  async verifyAvailableComment(comment) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [comment],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyOwnerComment(comment, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND user_id = $2',
      values: [comment, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('tidak punya hak untuk melakukan ini');
    }
  }

  async deleteComment(registerComment) {
    const query = {
      text: 'UPDATE comments SET is_deleted=TRUE where id = $1',
      values: [registerComment],
    };

    await this._pool.query(query);
  }

  async getComment(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted
      FROM comments
      LEFT JOIN users ON users.id = comments.user_id
      WHERE thread_id = $1
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
