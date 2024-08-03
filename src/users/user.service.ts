import { Department, Level, User } from "./user.interface";
import { UserRepository } from "./user.repository.interface";

export interface UserService {
  getUsers: (department?: string) => Promise<User[]>;
  getUser: (userId: string) => Promise<User | null>;
  deleteUser: (userId: string) => Promise<void>;
  createUser: (userData: {
    department: Department;
    name: string;
    level: Level;
  }) => Promise<User | null>;
}

export function userServiceFactory(
  userRepository: UserRepository
): UserService {
  return {
    getUsers: async (department?: string) => {
      return await userRepository.getAll(department);
    },
    getUser: async (userId: string) => {
      return await userRepository.getById(userId);
    },
    deleteUser: async (userId: string) => {
      await userRepository.delete(userId);
    },
    createUser: async (userData: {
      department: Department;
      name: string;
      level: Level;
    }) => {
      const { department, name, level } = userData;
      const user = { department, name, level };
      const newUser = await userRepository.create(user);
      return newUser;
    },
  };
}
