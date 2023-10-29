const SwaggerParser = require('swagger-parser');

async function getApiData(url) {
  let api = await SwaggerParser.validate(url);
  console.log('API name: %s, Version: %s', api.info.title, api.info.version);
  return api;
}

module.exports = getApiData;
/**async function getApiData(url) {
  let api = await SwaggerParser.validate(url);
  console.log('API name: %s, Version: %s', api.info.title, api.info.version);
  return api;
} 



version q funciona

async function getApiData() {
  let api = await SwaggerParser.validate(process.env.SWAGGER_URL);
  console.log('API name: %s, Version: %s', api.info.title, api.info.version);
  return api;
}*/