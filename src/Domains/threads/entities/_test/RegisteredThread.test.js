const RegisteredThread = require('../RegisteredThread');

describe('RegisteredThread entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'titlePayload',
    };

    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'titlePayload',
      owner: 'ownerPayload',
    };

    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create RegisteredThread correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'titlePayload',
      owner: 'ownerPayload',
    };

    // Action
    const registeredThread = new RegisteredThread(payload);

    // Assert
    expect(registeredThread).toBeInstanceOf(RegisteredThread);
    expect(registeredThread.id).toEqual(payload.id);
    expect(registeredThread.title).toEqual(payload.title);
    expect(registeredThread.owner).toEqual(payload.owner);
  });
});
