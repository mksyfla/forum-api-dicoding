/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'content', owner = 'user-123', threadId = 'thread-123',
  }) {
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments(id, content, date, user_id, thread_id, is_deleted) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING id',
      values: [id, content, date, owner, threadId],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },
};

module.exports = CommentTableTestHelper;
