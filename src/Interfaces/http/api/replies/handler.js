const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedComment = await addReplyUseCase.execute({
      ...request.payload, owner, threadId, commentId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteReplyHandler = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyHandler.execute({
      replyId, owner, threadId, commentId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = ReplyHandler;
