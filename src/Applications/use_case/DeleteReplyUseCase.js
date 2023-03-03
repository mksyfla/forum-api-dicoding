class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const {
      replyId, owner, threadId, commentId,
    } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._replyRepository.verifyAvailableReply(replyId);
    await this._replyRepository.verifyOwnerReply(replyId, owner);
    await this._replyRepository.deleteReply(replyId);
  }

  _verifyPayload(payload) {
    const {
      replyId, owner, threadId, commentId,
    } = payload;

    if (!commentId || !owner || !threadId || !replyId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof replyId !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
