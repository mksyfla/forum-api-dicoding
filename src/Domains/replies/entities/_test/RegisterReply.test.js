const RegisterReply = require('../RegisterReply');

describe('a registerReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'contentPayload',
    };

    // Action and Assert
    expect(() => new RegisterReply(payload)).toThrowError('REGISTER_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new RegisterReply(payload)).toThrowError('REGISTER_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RegisterReply correctly', () => {
    // Arrange
    const payload = {
      content: 'contentPayload',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const registerReply = new RegisterReply(payload);

    // Assert
    expect(registerReply).toBeInstanceOf(RegisterReply);
    expect(registerReply.content).toEqual(payload.content);
    expect(registerReply.owner).toEqual(payload.owner);
    expect(registerReply.threadId).toEqual(payload.threadId);
    expect(registerReply.commentId).toEqual(payload.commentId);
  });
});
