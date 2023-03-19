const RegisterLike = require('../../Domains/commentLikes/entities/RegisterLike');

class AddLikeCommentUseCase {
  constructor({ commentLikeRepository, commentRepository, threadRepository }) {
    this._commentLikeRepository = commentLikeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const registerLike = new RegisterLike(useCasePayload);
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId);
    await this._commentRepository.verifyAvailableComment(useCasePayload.commentId);
    return this._commentLikeRepository.likeComment(registerLike);
  }
}

module.exports = AddLikeCommentUseCase;
