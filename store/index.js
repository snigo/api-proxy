const Redis = require('ioredis');

const redis = new Redis('redis://localhost:6379/0');

const normalizeApiName = (apiName) => apiName.trim().replace(/\s+/, '-').toLowerCase();

const setApi = async ({
  apiName,
  baseUrl,
  key,
  keyParam,
}) => {
  console.log('Check!');
  const normalizedApiName = normalizeApiName(apiName);
  const record = {
    apiName,
    baseUrl,
    key,
    keyParam,
  };
  try {
    await redis.set('check-connection', 'true');
    const result = await redis.hmset(`api-proxy-${normalizedApiName}`, record);
    if (result !== 'OK') throw new Error('Cannot connect to Redis');
    console.log(result);
    return record;
  } catch (err) {
    console.log(err);
  }
};

const getApi = async (apiName) => {
  const normalizedApiName = normalizeApiName(apiName);

  try {
    const result = await redis.hgetall(`api-proxy-${normalizedApiName}`);
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  setApi,
  getApi,
};
