import { Department, Level, User } from "./user.model";
import { UserRepository } from "./user.repository";

export interface UserService {
  getUsers: (department?: string) => User[];
  getUser: (userId: string) => User | null;
  deleteUser: (userId: string) => void;
  createUser: (userData: {
    department: Department;
    name: string;
    level: Level;
  }) => User | null;
}

export function userServiceFactory(
  userRepository: UserRepository
): UserService {
  return {
    getUsers: (department?: string) => {
      return userRepository.getAll(department);
    },
    getUser: (userId: string) => {
      return userRepository.getById(userId);
    },
    deleteUser: (userId: string) => {
      userRepository.delete(userId);
    },
    createUser: (userData: {
      department: Department;
      name: string;
      level: Level;
    }) => {
      const id: string = crypto.randomUUID();
      const { department, name, level } = userData;
      const user = { id, department, name, level };
      userRepository.create(user);
      return userRepository.getById(id);
    },
  };
}
