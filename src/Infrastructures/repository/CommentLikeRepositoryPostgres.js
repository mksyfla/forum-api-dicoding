const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentLikeRepository = require('../../Domains/commentLikes/CommentLikeRepository');
const RegisteredLike = require('../../Domains/commentLikes/entities/RegisteredLike');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeComment(registerLike) {
    const { userId, commentId } = registerLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes_comment(id, user_id, comment_id) VALUES ($1, $2, $3) RETURNING id, user_id, comment_id',
      values: [id, userId, commentId],
    };

    const { rows } = await this._pool.query(query);

    const map = rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      commentId: row.comment_id,
    }));

    return new RegisteredLike(map[0]);
  }

  async verifyOwnerLike(userId, commentId) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async getLikeComment(commentId) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }

  async deleteLikeComment(userId, commentId) {
    const query = {
      text: 'DELETE FROM likes_comment WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentLikeRepositoryPostgres;
