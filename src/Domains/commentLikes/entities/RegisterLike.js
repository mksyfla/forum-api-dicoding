class RegisterLike {
  constructor(payload) {
    this._verifyPayload(payload);

    this.userId = payload.userId;
    this.commentId = payload.commentId;
  }

  _verifyPayload(payload) {
    const { userId, commentId } = payload;

    if (!userId || !commentId) {
      throw new Error('REGISTER_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof commentId !== 'string') {
      throw new Error('REGISTER_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisterLike;
