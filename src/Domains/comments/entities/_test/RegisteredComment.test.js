const RegisteredComment = require('../RegisteredComment');

describe('a RegisteredComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'contentPayload',
    };

    // Action and Assert
    expect(() => new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'contentPayload',
      owner: [],
    };

    // Action and Assert
    expect(() => new RegisteredComment(payload)).toThrowError('REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RegisteredComment correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'contentPayload',
      owner: 'user-123',
    };

    // Action
    const registeredComment = new RegisteredComment(payload);

    // Assert
    expect(registeredComment).toBeInstanceOf(RegisteredComment);
    expect(registeredComment.id).toEqual(payload.id);
    expect(registeredComment.content).toEqual(payload.content);
    expect(registeredComment.owner).toEqual(payload.owner);
  });
});
