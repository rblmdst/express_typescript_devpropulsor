import { User } from "./user.interface";
import { UserModel } from "./user.model";
import { UserRepository } from "./user.repository.interface";

export function userRepositoryFactory(): UserRepository {
  return {
    getAll: async (department?: string) => {
      if (department) {
        return await UserModel.find({ department });
      }
      return await UserModel.find();
    },
    getById: async (userId: string) => {
      return await UserModel.findById(userId);
    },
    delete: async (userId: string) => {
      await UserModel.deleteOne({ _id: userId });
    },
    create: async (user: Omit<User, "_id">) => {
      return await UserModel.create(user);
    },
  };
}
