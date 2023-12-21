const ApiError = require('../exceptions/api-error');
const postService = require('../service/post-service');

class PostController {
  async create(req, res, next) {
    try {
      const post = await postService.create(req, res);
      return post;
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
