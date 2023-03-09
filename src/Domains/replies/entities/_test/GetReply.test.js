const GetReply = require('../GetReply');

describe('a GetReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
    };

    // Action and Assert
    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'test',
      date: 24,
      content: 'content',
      is_deleted: 'false',
    };

    // Action and Assert
    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetReply with is_deleted true correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: 'date',
      content: 'content',
      is_deleted: true,
    };

    // Action
    const getReply = new GetReply(payload);

    // Assert
    expect(getReply).toBeInstanceOf(GetReply);
    expect(getReply.id).toEqual(payload.id);
    expect(getReply.username).toEqual(payload.username);
    expect(getReply.date).toEqual(payload.date);
    expect(getReply.content).toEqual('**balasan telah dihapus**');
  });

  it('should create GetReply correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: 'date',
      content: 'content',
      is_deleted: false,
    };

    // Action
    const getReply = new GetReply(payload);

    // Assert
    expect(getReply).toBeInstanceOf(GetReply);
    expect(getReply.id).toEqual(payload.id);
    expect(getReply.username).toEqual(payload.username);
    expect(getReply.date).toEqual(payload.date);
    expect(getReply.content).toEqual(payload.content);
  });
});
