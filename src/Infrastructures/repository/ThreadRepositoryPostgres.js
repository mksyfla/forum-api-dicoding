const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(registerThread) {
    const { title, body, owner } = registerThread;
    const id = `thread-${this._idGenerator()}`;

    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads(id, title, body, date, user_id) VALUES($1, $2, $3, $4, $5) RETURNING id, title, user_id as owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new RegisteredThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThread(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username
      FROM threads
      LEFT JOIN users ON users.id = threads.user_id
      WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
