const CommentLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'commentLike',
  register: async (server, { container }) => {
    const commentLikeHandler = new CommentLikeHandler(container);
    server.route(routes(commentLikeHandler));
  },
};
