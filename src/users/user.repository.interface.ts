import { User } from "./user.interface";

export interface UserRepository {
  getAll: (department?: string) => Promise<User[]>;
  getById: (userId: string) => Promise<User | null>;
  delete: (userId: string) => Promise<void>;
  create: (user: Omit<User, "_id">) => Promise<User>;
}
