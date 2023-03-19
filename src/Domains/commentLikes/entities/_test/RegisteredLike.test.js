const RegisteredLike = require('../RegisteredLike');

describe('a RegisteredLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new RegisteredLike(payload)).toThrowError('REGISTERED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      userId: 'user-123',
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new RegisteredLike(payload)).toThrowError('REGISTERED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RegisteredLike correctly', () => {
    // Arrange
    const payload = {
      id: 'like-123',
      userId: 'user-123',
      commentId: 'comment-123',
    };

    // Action
    const registeredLike = new RegisteredLike(payload);

    // Assert
    expect(registeredLike).toBeInstanceOf(RegisteredLike);
    expect(registeredLike).toEqual(payload);
  });
});
