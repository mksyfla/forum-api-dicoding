const GetComment = require('../../Domains/comments/entities/GetComment');
const GetReply = require('../../Domains/replies/entities/GetReply');

class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { threadId } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getComment(threadId);
    const likeCount = await this._commentLikeRepository.getLikeComment(threadId);
    const replies = await this._replyRepository.getReply(threadId);

    const map = {
      ...thread,
      comments: comments.map((comment) => ({
        ...new GetComment(
          comment,
          likeCount
            .filter((like) => like.comment_id === comment.id).length,
          replies
            .filter((reply) => reply.comment_id === comment.id)
            .map((reply) => ({
              ...new GetReply(reply),
            })),
        ),
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
