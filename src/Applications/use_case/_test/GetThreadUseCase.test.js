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
          replies: [
            {
              id: 'reply-123',
              username: 'username',
              date: 'date',
              content: 'content',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

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
      ]));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
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
    expect(mockReplyRepository.getReply)
      .toBeCalledWith(useCasePayload.threadId);
  });
});
