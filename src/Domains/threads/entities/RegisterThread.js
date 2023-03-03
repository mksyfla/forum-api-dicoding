class RegisterThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { title, body, owner } = payload;

    if (!title || !body || !owner) {
      throw new Error('REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 50) {
      throw new Error('REGISTER_THREAD.TITLE_LIMIT_CHAR');
    }

    if (owner.length > 50) {
      throw new Error('REGISTER_THREAD.OWNER_LIMIT_CHAR');
    }
  }
}

module.exports = RegisterThread;
