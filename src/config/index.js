const path = require('path');
const { Joi } = require('express-validation');
const dotenv = require('dotenv');

const nodeEnvValidator = Joi.string()
  .allow('development', 'test')
  .default('development');

const nodeEnvSchema = Joi.object({
    NODE_ENV: nodeEnvValidator,
}).unknown().required();

// getting environment to load relative .env file
// Throw error if valid environment is not passed
const { error: envError, value } = nodeEnvSchema.validate(process.env);
if (envError) {
    throw new Error(`Environment validation error: ${envError.message}`);
}

// load vars in .env.* file in PROCESS.ENV
const envFilePath = path.resolve(__dirname, '..', '..', `.env.${value.NODE_ENV}`);
const envConfig = dotenv.config({ path: envFilePath });
if (envConfig.error) {
    throw new Error(`Environment file config error: ${envConfig.error}`);
}

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    mongo: {
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
    },
};

module.exports = config;
