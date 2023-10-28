const SwaggerParser = require('swagger-parser');

async function getApiData() {
  let api = await SwaggerParser.validate(process.env.SWAGGER_URL);
  console.log('API name: %s, Version: %s', api.info.title, api.info.version);
  return api;
}

module.exports = getApiData;