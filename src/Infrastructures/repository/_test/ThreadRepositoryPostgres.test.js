const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist register thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const registerThread = new RegisterThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(registerThread);

      // Assert
      const thread = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const registerThread = new RegisterThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(registerThread);

      // Assert
      expect(registeredThread).toStrictEqual(new RegisteredThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread id not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const thread = 'id';

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(thread))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread id available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const thread = 'thread-123';

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(thread))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThread function', () => {
    it('should get thread from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({ date: 'date' });

      const expectedPayload = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        username: 'dicoding',
        date: 'date',
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123';

      // Action
      const thread = await threadRepositoryPostgres.getThread(threadId);

      // Assert
      expect(thread.id).toEqual(expectedPayload.id);
      expect(thread.title).toEqual(expectedPayload.title);
      expect(thread.body).toEqual(expectedPayload.body);
      expect(thread.username).toEqual(expectedPayload.username);
      expect(thread.date).toEqual(expectedPayload.date);
    });
  });
});
