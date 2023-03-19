/* istanbul ignore test */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AddTableTestHelper = {
  async likeAlbum({ id = 'like-123', userId = 'user-123', commentId = 'comment-123' }) {
    const query = {
      text: 'INSER INTO likes_comment(id, userId, commentId) VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, commentId],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes_comment');
  },
};

module.exports = AddTableTestHelper;
