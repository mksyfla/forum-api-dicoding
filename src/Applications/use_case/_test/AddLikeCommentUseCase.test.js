const CommentLikeRepository = require('../../../Domains/commentLikes/CommentLikeRepository');
const RegisterLike = require('../../../Domains/commentLikes/entities/RegisterLike');
const RegisteredLike = require('../../../Domains/commentLikes/entities/RegisteredLike');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddLikeCommentUseCase = require('../AddLikeCommentUseCase');

describe('AddLikeCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };
    const expectedRegisteredLike = new RegisteredLike({
      id: 'like-123',
      userId: 'user-123',
      commentId: 'comment-123',
    });

    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyOwnerLike = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new RegisteredLike({
        id: 'like-123',
        userId: 'user-123',
        commentId: 'comment-123',
      })));

    const addLikeCommentUseCase = new AddLikeCommentUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const registeredLike = await addLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(registeredLike).toStrictEqual(expectedRegisteredLike);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.verifyOwnerLike).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId,
    );
    expect(mockCommentLikeRepository.likeComment).toBeCalledWith(new RegisterLike({
      userId: useCasePayload.userId,
      commentId: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
    }));
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };
    const expectedRegisteredLike = new RegisteredLike({
      id: 'like-123',
      userId: 'user-123',
      commentId: 'comment-123',
    });

    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.verifyOwnerLike = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new RegisteredLike({
        id: 'like-123',
        userId: 'user-123',
        commentId: 'comment-123',
      })));

    const addLikeCommentUseCase = new AddLikeCommentUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const registeredLike = await addLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(registeredLike).toStrictEqual(expectedRegisteredLike);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.verifyOwnerLike).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId,
    );
    expect(mockCommentLikeRepository.deleteLikeComment).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId,
    );
  });
});
