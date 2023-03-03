const RegisterThread = require('../RegisterThread');

describe('RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'titlePayload',
    };

    // Action and Assert
    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: 'bodyPayload',
      owner: [],
    };

    // Action and Assert
    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contain more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'titlePayloadtitlePayloadtitlePayloadtitlePayloadtitlePayload',
      body: 'bodyPayload',
      owner: 'ownerPayload',
    };

    // Action and Assert
    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should throw error when owner contain more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'titlePayload',
      body: 'bodyPayload',
      owner: 'ownerPayloadownerPayloadownerPayloadownerPayloadownerPayload',
    };

    // Action and Assert
    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.OWNER_LIMIT_CHAR');
  });

  it('should create RegisterThread correctly', () => {
    // Arrange
    const payload = {
      title: 'titlePayload',
      body: 'bodyPayload',
      owner: 'ownerPayload',
    };

    // Action
    const registerThread = new RegisterThread(payload);

    // Assert
    expect(registerThread).toBeInstanceOf(RegisterThread);
    expect(registerThread.title).toEqual(payload.title);
    expect(registerThread.body).toEqual(payload.body);
    expect(registerThread.owner).toEqual(payload.owner);
  });
});
