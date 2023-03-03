const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTestHelper = require('../../../../tests/ReplyTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const RegisterReply = require('../../../Domains/replies/entities/RegisterReply');
const RegisteredReply = require('../../../Domains/replies/entities/RegisteredReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ReplyTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist reply', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      const registerReply = new RegisterReply({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(registerReply);

      // Assert
      const reply = await ReplyTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      const registerReply = new RegisterReply({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredReply = await replyRepositoryPostgres.addReply(registerReply);

      // Assert
      expect(registeredReply).toStrictEqual(new RegisteredReply({
        id: 'reply-123',
        content: 'content',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableReply function', () => {
    it('should throw NotFoundError when reply id not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const reply = 'id';

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply(reply))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when reply id available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await ReplyTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const reply = 'reply-123';

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply(reply))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyOwnerReply function', () => {
    it('should throw AuthorizationError when user does not have access to reply id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await ReplyTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const reply = 'reply-123';
      const owner = 'user-246';

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyOwnerReply(reply, owner))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when user have access to reply id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await ReplyTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const reply = 'reply-123';
      const owner = 'user-123';

      // Action and Assert
      await expect(replyRepositoryPostgres.verifyOwnerReply(reply, owner))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await ReplyTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replyId = 'reply-123';

      // Action
      await replyRepositoryPostgres.deleteReply(replyId);

      // Assert
      const reply = await ReplyTestHelper.findReplyById(replyId);
      expect(reply[0].is_deleted).toEqual(true);
    });
  });

  describe('getReply function', () => {
    it('should get comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await ReplyTestHelper.addReply({});

      const expectedPayload = {
        id: 'reply-123',
        username: 'dicoding',
        content: 'content',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const threadId = 'thread-123';

      // Action
      const replies = await replyRepositoryPostgres.getReply(threadId);

      // Assert
      expect(replies[0].id).toEqual(expectedPayload.id);
      expect(replies[0].username).toEqual(expectedPayload.username);
      expect(replies[0].content).toEqual(expectedPayload.content);
    });
  });
});
