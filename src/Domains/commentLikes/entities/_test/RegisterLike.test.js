const RegisterLike = require('../RegisterLike');

describe('a registerLike entities', () => {
  it('should throw error when payload did not meet contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new RegisterLike(payload)).toThrowError('REGISTER_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 123,
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new RegisterLike(payload)).toThrowError('REGISTER_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RegisterLike correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    // Action
    const registerLike = new RegisterLike(payload);

    // Assert
    expect(registerLike).toBeInstanceOf(RegisterLike);
    expect(registerLike).toEqual(payload);
  });
});
