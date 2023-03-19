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
    const isLiked = await this._commentLikeRepository.verifyOwnerLike(
      useCasePayload.userId,
      useCasePayload.commentId,
    );

    if (!isLiked) {
      return this._commentLikeRepository.likeComment(registerLike);
    }

    return this._commentLikeRepository.deleteLikeComment(
      useCasePayload.userId,
      useCasePayload.commentId,
    );
  }
}

module.exports = AddLikeCommentUseCase;
