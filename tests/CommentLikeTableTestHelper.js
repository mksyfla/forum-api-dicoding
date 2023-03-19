/* istanbul ignore test */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AddTableTestHelper = {
  async likeComment({ id = 'like-123', userId = 'user-123', commentId = 'comment-123' }) {
    const query = {
      text: 'INSERT INTO likes_comment(id, user_id, comment_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, commentId],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },

  async findLikeByCommentId(commentId) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rowCount;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes_comment');
  },
};

module.exports = AddTableTestHelper;
