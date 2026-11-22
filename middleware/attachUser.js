import * as usersRepository from "../repositories/usersRepository.js";
import { toUserDto } from "../dtos/userDto.js";

export const attachUser = async (req, res, next) => {
  try {
    const userId = req.session?.userId;

    if (userId) {
      const account = await usersRepository.findById(userId);

      if (account) {
        req.user = {
          id: account._id.toString(),
          email: account.email,
          role: account.role,
        };

        res.locals.user = toUserDto(account);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
