const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});

      const registerComment = new RegisterComment({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(registerComment);

      // Assert
      const comment = await CommentTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});

      const registerComment = new RegisterComment({
        content: 'content',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredComment = await commentRepositoryPostgres.addComment(registerComment);

      // Assert
      expect(registeredComment).toStrictEqual(new RegisteredComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when comment id not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = 'id';

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(comment))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment id available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = 'comment-123';

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(comment))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyOwnerComment function', () => {
    it('should throw AuthorizationError when user does not have access to comment id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = 'comment-123';
      const owner = 'user-246';

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyOwnerComment(comment, owner))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when user have access to comment id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = 'comment-123';
      const owner = 'user-123';

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyOwnerComment(comment, owner))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comment = await CommentTableTestHelper.findCommentById(commentId);
      expect(comment[0].is_deleted).toEqual(true);
    });
  });

  describe('getComment function', () => {
    it('should get comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({ date: 'date' });

      const expectedPayload = {
        id: 'comment-123',
        username: 'dicoding',
        content: 'content',
        date: 'date',
        is_deleted: false,
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';

      // Action
      const comments = await commentRepositoryPostgres.getComment(threadId);

      // Assert
      expect(comments[0].id).toEqual(expectedPayload.id);
      expect(comments[0].username).toEqual(expectedPayload.username);
      expect(comments[0].content).toEqual(expectedPayload.content);
      expect(comments[0].date).toEqual(expectedPayload.date);
      expect(comments[0].is_deleted).toEqual(expectedPayload.is_deleted);
    });
  });
});
