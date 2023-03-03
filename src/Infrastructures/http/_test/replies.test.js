const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies/', () => {
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ServerTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };
      const accessToken = await ServerTestHelper.getAccessToken({});
      const threadId = await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};

      const accessToken = await ServerTestHelper.getAccessToken({});
      const threadId = await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

      const accessToken = await ServerTestHelper.getAccessToken({});
      const threadId = await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan karena tipe data tidak sesuai');
    });

    it('should response 401 when did not authenticated', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };

      await UsersTableTestHelper.addUser({});
      const threadId = await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread is not available', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };

      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/xxx/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment is not available', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };

      const accessToken = await ServerTestHelper.getAccessToken({});
      const threadId = await ThreadTableTestHelper.addThread({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/xxx/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken({});
      const threadId = await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const replyId = await ReplyTableTestHelper.addReply({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when did not authenticated', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const threadId = await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const replyId = await ReplyTableTestHelper.addReply({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when the thread is not available', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken({});
      await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const replyId = await ReplyTableTestHelper.addReply({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/xxx/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when the comment is not available', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken({});
      const threadId = await ThreadTableTestHelper.addThread({});
      await CommentTableTestHelper.addComment({});
      const replyId = await ReplyTableTestHelper.addReply({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/xxx/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 404 when the reply is not available', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken({});
      const threadId = await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan tidak ditemukan');
    });

    it('should response 403 when user does not have access to reply', async () => {
      // Arrange
      await ServerTestHelper.getAccessToken({});
      const threadId = await ThreadTableTestHelper.addThread({});
      const commentId = await CommentTableTestHelper.addComment({});
      const replyId = await ReplyTableTestHelper.addReply({});
      const server = await createServer(container);

      const AnotherAccessToken = await ServerTestHelper.getAccessToken({ id: 'user-246', username: 'kaspil' });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${AnotherAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak punya hak untuk melakukan ini');
    });
  });
});
