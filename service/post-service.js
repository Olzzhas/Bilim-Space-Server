const tokenService = require('../service/token-service');
const postModel = require('../models/post-model');

class PostService {
  async create(req, res) {
    const { title, body } = req.body;

    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader.split(' ')[1];
    const userData = tokenService.validateAccessToken(accessToken);

    const post = await postModel.create({
      title: title,
      body: body,
      author: userData.id,
    });

    return res.json(post);
  }
}

module.exports = new PostService();
