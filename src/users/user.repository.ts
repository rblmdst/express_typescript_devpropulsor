import { User } from "./user.interface";
import { UserModel } from "./user.model";
import { UserRepository } from "./user.repository.interface";

export const userRepositoryFactory: () => UserRepository = () => {
  return {
    create: async (user: Omit<User, "_id">) => {
      const newUser = new UserModel(user);
      const createdUser = await newUser.save();
      return createdUser;
    },
    getByEmail: (email: string) => {
      return UserModel.findOne({ email });
    },
  };
};
