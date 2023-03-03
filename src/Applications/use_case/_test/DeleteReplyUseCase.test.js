const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteReplyUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action and Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 123,
      owner: 'user-123',
      threadId: 123,
      commentId: [],
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action and Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyAvailableReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyOwnerReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.verifyAvailableReply)
      .toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.verifyOwnerReply)
      .toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
