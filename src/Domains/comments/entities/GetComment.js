/* eslint-disable camelcase */
class GetComment {
  constructor(payload, replies) {
    this._verifyPayload(payload, replies);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.is_deleted ? '**komentar telah dihapus**' : payload.content;
    this.replies = replies;
  }

  _verifyPayload(payload, replies) {
    const {
      id, username, date, content, is_deleted,
    } = payload;

    if (!id || !username || !date || !content || !replies) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof is_deleted !== 'boolean' || !(Array.isArray(replies))) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetComment;
