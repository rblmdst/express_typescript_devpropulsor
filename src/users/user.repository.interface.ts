import { User } from "./user.interface";

export interface UserRepository {
  create: (user: Omit<User, "_id">) => Promise<User>;
  getByEmail: (email: string) => Promise<User | null>;
}
