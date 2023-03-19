class GetLike {
  constructor(payload) {
    this._verifyPayload(payload);

    this.likeCount = payload.likeCount;
  }

  _verifyPayload(payload) {
    const { likeCount } = payload;

    if (!likeCount) {
      throw new Error('GET_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof likeCount !== 'number') {
      throw new Error('GET_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetLike;
