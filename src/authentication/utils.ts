import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;
export const secret = "a3#uezuop";

export const hashPassword = (plainText: string) => {
  return bcrypt.hash(plainText, saltRounds);
};

export const checkPassword = (plainText: string, hashPassword: string) => {
  return bcrypt.compare(plainText, hashPassword);
};

export const generateJWT = (options: {
  payload: Record<string, any>;
  secret: string;
  expiresIn: number | string;
}) => {
  return new Promise<string>((resolve, reject) => {
    const { payload, secret, expiresIn } = options;
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) {
        return reject(err);
      }
      return resolve(token as string);
    });
  });
};

export const verifyJWT = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        return reject(err);
      }
      return resolve(decodedToken);
    });
  });
};
