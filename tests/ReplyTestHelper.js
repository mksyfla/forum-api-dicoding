const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const ReplyTestHelper = {
  async addReply({
    id = 'reply-123', content = 'content', owner = 'user-123', threadId = 'thread-123', commentId = 'comment-123',
  }) {
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies(id, content, date, user_id, thread_id, comment_id, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, FALSE) RETURNING id',
      values: [id, content, date, owner, threadId, commentId],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies');
  },
};

module.exports = ReplyTestHelper;
