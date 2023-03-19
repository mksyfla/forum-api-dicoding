const GetLike = require('../GetLike');

describe('a GetLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new GetLike(payload)).toThrowError('GET_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      likeCount: '1',
    };

    // Action and Assert
    expect(() => new GetLike(payload)).toThrowError('GET_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetLike correctly', () => {
    // Arrange
    const payload = {
      likeCount: 1,
    };

    // Action
    const getLike = new GetLike(payload);

    // Assert
    expect(getLike).toBeInstanceOf(GetLike);
    expect(getLike.likeCount).toEqual(payload.likeCount);
  });
});
