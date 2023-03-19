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

    const likeCount = 1;

    const replies = {};

    // Action and Assert
    expect(() => new GetComment(payload, likeCount, replies)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetComment with is_deleted true correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'username',
      date: 'date',
      content: 'test',
      is_deleted: true,
    };

    const likeCount = 1;

    const replies = [];

    // Action
    const getComment = new GetComment(payload, likeCount, replies);

    // Assert
    expect(getComment).toBeInstanceOf(GetComment);
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual('**komentar telah dihapus**');
    expect(getComment.likeCount).toEqual(likeCount);
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

    const likeCount = 1;

    const replies = [];

    // Action
    const getComment = new GetComment(payload, likeCount, replies);

    // Assert
    expect(getComment).toBeInstanceOf(GetComment);
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual(payload.content);
    expect(getComment.likeCount).toEqual(likeCount);
    expect(getComment.replies).toEqual(replies);
  });
});
