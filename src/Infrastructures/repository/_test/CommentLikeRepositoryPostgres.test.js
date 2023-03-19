const CommentLikeTableTestHelper = require('../../../../tests/CommentLikeTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const RegisterLike = require('../../../Domains/commentLikes/entities/RegisterLike');
const RegisteredLike = require('../../../Domains/commentLikes/entities/RegisteredLike');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikeTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('likeComment function', () => {
    it('should persist likeComment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      const registerLike = new RegisterLike({
        userId: 'user-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentLikeRepositoryPostgres.likeComment(registerLike);

      // Assert
      const like = await CommentLikeTableTestHelper.findLikeByCommentId('comment-123');
      expect(like).toEqual(1);
    });

    it('should return registered like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});

      const registerLike = new RegisterLike({
        userId: 'user-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const registeredLike = await commentLikeRepositoryPostgres.likeComment(registerLike);

      // Assert
      expect(registeredLike).toStrictEqual(new RegisteredLike({
        id: 'like-123',
        userId: 'user-123',
        commentId: 'comment-123',
      }));
    });
  });

  describe('verifyOwnerLike function', () => {
    it('should throw AuthorizationError when user does not have access to comment id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await CommentLikeTableTestHelper.likeComment({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      const userId = 'user-246';
      const commentId = 'comment-123';

      // Action and Assert
      await expect(commentLikeRepositoryPostgres.verifyOwnerLike(userId, commentId))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when user have access to comment id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await CommentLikeTableTestHelper.likeComment({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      const userId = 'user-123';
      const commentId = 'comment-123';

      // Action and Assert
      await expect(commentLikeRepositoryPostgres.verifyOwnerLike(userId, commentId))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('getLikeComment Function', () => {
    it('should get like comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      await CommentLikeTableTestHelper.likeComment({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {},
      );

      // Action
      const likes = await commentLikeRepositoryPostgres.getLikeComment('comment-123');

      // Assert
      expect(likes).toEqual(1);
    });
  });
});
