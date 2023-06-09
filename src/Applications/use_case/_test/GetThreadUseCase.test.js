const CommentLikeRepository = require('../../../Domains/commentLikes/CommentLikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const getThreadUseCase = new GetThreadUseCase({});

    // Action and Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedPayload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: 'date',
      username: 'username',
      comments: [
        {
          id: 'comment-123',
          username: 'username',
          date: 'date',
          content: 'content',
          likeCount: 1,
          replies: [
            {
              id: 'reply-123',
              username: 'username',
              date: 'date',
              content: 'content',
            },
            {
              id: 'reply-246',
              username: 'username',
              date: 'date',
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: 'comment-246',
          username: 'username',
          date: 'date',
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date: 'date',
        username: 'username',
      }));
    mockCommentRepository.getComment = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'username',
          date: 'date',
          content: 'content',
          is_deleted: false,
        },
        {
          id: 'comment-246',
          username: 'username',
          date: 'date',
          content: 'content',
          is_deleted: true,
        },
      ]));
    mockCommentLikeRepository.getLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'like-123',
          user_id: 'user-123',
          comment_id: 'comment-123',
        },
      ]));
    mockReplyRepository.getReply = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'reply-123',
          username: 'username',
          date: 'date',
          content: 'content',
          comment_id: 'comment-123',
          is_deleted: false,
        },
        {
          id: 'reply-246',
          username: 'username',
          date: 'date',
          content: 'content',
          comment_id: 'comment-123',
          is_deleted: true,
        },
      ]));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toStrictEqual(expectedPayload);
    expect(mockThreadRepository.verifyAvailableThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getComment)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentLikeRepository.getLikeComment)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getReply)
      .toBeCalledWith(useCasePayload.threadId);
  });
});
