/* eslint-disable camelcase */
class GetReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.is_deleted ? '**balasan telah dihapus**' : payload.content;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, is_deleted,
    } = payload;

    if (!id || !username || !date || !content) {
      throw new Error('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof is_deleted !== 'boolean') {
      throw new Error('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetReply;
