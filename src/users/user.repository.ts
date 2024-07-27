import { User } from "./user.model";
import { users as userList } from "./users";
let users = [...userList];

export interface UserRepository {
  getAll: (department?: string) => User[];
  getById: (userId: string) => User | null;
  delete: (userId: string) => void;
  create: (user: User) => void;
}

export function userRepositoryFactory(): UserRepository {
  return {
    getAll: (department?: string) => {
      if (department) {
        return users.filter(
          (user) =>
            user.department.toLowerCase() ===
            (department as string).toLowerCase()
        );
      }
      return users;
    },
    getById: (userId: string) => {
      return users.find((user) => user.id === userId) || null;
    },
    delete: (userId: string) => {
      users = users.filter((user) => user.id !== userId);
    },
    create: (user: User) => {
      users = [...users, user];
    },
  };
}
