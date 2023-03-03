const GetComment = require('../../Domains/comments/entities/GetComment');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { threadId } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getComment(threadId);

    const map = {
      ...thread,
      comments: comments.map((comment) => ({
        ...new GetComment(comment),
      })),
    };

    return map;
  }

  _verifyPayload(payload) {
    const { threadId } = payload;

    if (!threadId) {
      throw new Error('GET_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = GetThreadUseCase;
