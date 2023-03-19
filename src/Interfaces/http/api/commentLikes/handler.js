const AddLikeCommentUseCase = require('../../../../Applications/use_case/AddLikeCommentUseCase');

class CommentLikeHandler {
  constructor(container) {
    this._container = container;
  }

  async LikePostHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addLikeCommentUseCase = this._container.getInstance(AddLikeCommentUseCase.name);
    await addLikeCommentUseCase.execute({
      userId, commentId, threadId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentLikeHandler;
