const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
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
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetComment with is_deleted true correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: 'date',
      content: '**komentar telah dihapus**',
      is_deleted: true,
    };

    // Action
    const getComment = new GetComment(payload);

    // Assert
    expect(getComment).toBeInstanceOf(GetComment);
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual(payload.content);
  });

  it('should create GetComment correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: 'date',
      content: 'content',
      is_deleted: false,
    };

    // Action
    const getComment = new GetComment(payload);

    // Assert
    expect(getComment).toBeInstanceOf(GetComment);
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual(payload.content);
  });
});
