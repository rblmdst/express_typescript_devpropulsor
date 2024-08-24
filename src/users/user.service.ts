import {
  checkPassword,
  generateJWT,
  hashPassword,
} from "../authentication/utils";
import { ConfigService } from "../core/services/configuration.service";
import { NewCreatedUser, User } from "./user.interface";
import { UserRepository } from "./user.repository.interface";

export interface UserService {
  registerUser: (user: Omit<User, "_id">) => Promise<NewCreatedUser>;
  getUserByEmail: (email: string) => Promise<User | null>;
  checkPassword: (plainText: string, hashPassword: string) => Promise<boolean>;
  generateAuthToken: (user: User) => Promise<string>;
}

export const userServiceFactory: (
  userRepository: UserRepository,
  configService: ConfigService
) => UserService = (
  userRepository: UserRepository,
  configService: ConfigService
) => {
  return {
    registerUser: async (user: Omit<User, "_id">) => {
      try {
        const saltRounds = configService.get("saltRounds") as number;
        const hasedPassword = await hashPassword(user.password, saltRounds);
        const newUser = await userRepository.create({
          ...user,
          password: hasedPassword,
        });
        const { email, firstName, lastName, _id } = newUser;
        return { email, firstName, lastName, _id };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getUserByEmail: (email: string) => {
      return userRepository.getByEmail(email);
    },
    checkPassword: (plainText: string, hashPassword: string) => {
      return checkPassword(plainText, hashPassword);
    },
    generateAuthToken: (user: User) => {
      const { email, firstName, lastName, _id } = user;
      const payload = { email, firstName, lastName, _id };
      const ttl = configService.get("jwtTTL") as string | number;
      const secret = configService.get("jwtSecret") as string;
      const options = {
        payload,
        secret,
        expiresIn: ttl,
      };
      return generateJWT(options);
    },
  };
};
