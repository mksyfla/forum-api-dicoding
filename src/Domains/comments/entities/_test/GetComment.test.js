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

    const replies = {};

    // Action and Assert
    expect(() => new GetComment(payload, replies)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetComment with is_deleted true correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: 'date',
      content: 'test',
      is_deleted: true,
      replies: [],
    };

    const replies = [];

    // Action
    const getComment = new GetComment(payload, replies);

    // Assert
    expect(getComment).toBeInstanceOf(GetComment);
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual('**komentar telah dihapus**');
    expect(getComment.replies).toEqual(replies);
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

    const replies = [];

    // Action
    const getComment = new GetComment(payload, replies);

    // Assert
    expect(getComment).toBeInstanceOf(GetComment);
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual(payload.content);
    expect(getComment.replies).toEqual(replies);
  });
});
