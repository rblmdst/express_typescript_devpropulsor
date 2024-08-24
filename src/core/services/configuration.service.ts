const { NODE_ENV, PORT, DB_URI, SALT_ROUDS, JWT_SECRET, JWT_TTL } = process.env;

const config = {
  env: NODE_ENV || "development",
  port: +(PORT || 3000),
  dbUri: DB_URI,
  saltRounds: +(SALT_ROUDS || 0),
  jwtSecret: JWT_SECRET,
  jwtTTL: JWT_TTL,
};

type VarKey = keyof typeof config;

export function createConfigServiceFactory() {
  return {
    get: (key: VarKey) => config[key],
  };
}

export type ConfigService = ReturnType<typeof createConfigServiceFactory>;
