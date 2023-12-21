const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

const ApiError = require('../exceptions/api-error');
const userModel = require('../models/user-model');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await UserModel.create({ email: email, password: hashPassword, activationLink });
    await mailService.sendActivationMail(
      email,
      `http://localhost:5000/api/activate/${activationLink}`,
    );

    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const User = await UserModel.findOne({ activationLink });

    if (!User) {
      throw ApiError.BadRequest('Ссылка для активации недействительна');
    }

    User.isActivated = true;
    await User.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('По,льзователь не найден');
    }

    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw ApiError.BadRequest('Неверный пароль');
    }

    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDatabase = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDatabase) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { tokens, user: userDto };
  }

  async getUsers() {
    const users = await userModel.find();
    return users;
  }
}
module.exports = new UserService();
