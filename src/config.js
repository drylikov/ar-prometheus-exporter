const dotenvParseVariables = require('dotenv-parse-variables');
const process = require('process')

env = dotenvParseVariables(process.env);

const CONFIG = {
  MODE: env.MODE || 'PASSIVE',
  PORT: env.PORT || 9097,
  API_KEY: env.API_KEY,
  DOMAINS: (typeof(env.DOMAINS) === 'string') ? [env.DOMAINS] : env.DOMAINS,
  UPDATE_INTERVAL: env.UPDATE_INTERVAL || 30000,
  BASE_URL: env.BASE_URL || 'https://napi.arvancloud.com/cdn/4.0/',
  METRICS_PERIOD: env.METRICS_PERIOD || '3h',
  METRICS_PREFIX: env.METRICS_PREFIX || 'arvancloud_cdn_',
}

module.exports = CONFIG;
