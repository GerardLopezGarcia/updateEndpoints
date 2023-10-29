const getApiData = require('./utils/swagger-parser');
const sendEmail = require('./utils/mailer');
const Api = require('./models/api');
const fs = require('fs');
const diff = require('deep-diff');
require('dotenv').config();

function formatChangesHtml(changes) {
  return changes.map(change => {
    let path = change.path.join('.');
    switch (change.kind) {
      case 'N':
        return `<li>🟢Nuevo endpoint: ${path} -> <pre>${JSON.stringify(change.rhs, null, 2)}</pre></li><br>`;
      case 'D':
        return `<li>❌Endpoint eliminado: ${path}</li><br>`;
      case 'E':
        return `<li>🚨Cambio en el endpoint ${path}: ${change.lhs} -> ${change.rhs}</li><br>`;
      case 'A':
        return `<li>❗Cambio en el array ${path}: <pre>${JSON.stringify(change.item, null, 2)}</pre></li><br>`;
    }
  }).join('');
}

async function main() {
  let urls = [process.env.SWAGGER_URL1, process.env.SWAGGER_URL2, process.env.SWAGGER_URL3];
  let allChanges = [];

  for (let url of urls) {
    let apiData = await getApiData(url);
    let api = new Api(apiData);
    let newEndpoints = api.getEndpoints();

    // Carga los endpoints antiguos
    let oldEndpoints;
    let filename = `endpoints-${url.replace(/\W/g, '_')}.json`;
    try {
      oldEndpoints = JSON.parse(fs.readFileSync(filename));
    } catch (error) {
      oldEndpoints = {};
    }

    // Detecta los cambios en los endpoints
    let changes = diff(oldEndpoints, newEndpoints);

    if (changes) {
      console.log('Se han detectado los siguientes cambios:', changes);
      allChanges.push(`<h2>Cambios en la documentación: ${url}</h2>`);
      allChanges.push(`<ul>${formatChangesHtml(changes)}</ul>`);

      // Guarda los nuevos endpoints
      fs.writeFileSync(filename, JSON.stringify(newEndpoints, null, 2));
    } else {
      console.log('No se han detectado cambios.');
    }
  }

  if (allChanges.length > 0) {
    // Aquí es donde se utiliza la función del paso 3
    let changesHtml = allChanges.join('');
    await sendEmail(changesHtml);
  }
}

main();

/**async function main() {
  let urls = [process.env.SWAGGER_URL1, process.env.SWAGGER_URL2, process.env.SWAGGER_URL3];
  let allChanges = [];

  for (let url of urls) {
    let apiData = await getApiData(url);
    let api = new Api(apiData);
    let newEndpoints = api.getEndpoints();

    // Carga los endpoints antiguos
    let oldEndpoints;
    let filename = `endpoints-${url.replace(/\W/g, '_')}.json`; // Aquí es donde se añade la línea
    try {
      oldEndpoints = JSON.parse(fs.readFileSync(filename));
    } catch (error) {
      oldEndpoints = {};
    }

    // Detecta los cambios en los endpoints
    let changes = diff(oldEndpoints, newEndpoints);

    if (changes) {
      console.log('Se han detectado los siguientes cambios:', changes);
      allChanges.push(...changes);

      // Guarda los nuevos endpoints
      fs.writeFileSync(filename, JSON.stringify(newEndpoints, null, 2)); // Aquí también se utiliza 'filename'
    } else {
      console.log('No se han detectado cambios.');
    }
  }

  if (allChanges.length > 0) {
    // Aquí es donde se utiliza la función del paso 3
    let changesHtml = `<ul>${formatChangesHtml(allChanges)}</ul>`;
    await sendEmail(changesHtml);
  }
}

main();

version q funciona --------- 

  let apiData = await getApiData();
  let api = new Api(apiData);
  let newEndpoints = api.getEndpoints();

  // Carga los endpoints antiguos
  let oldEndpoints;
  try {
    oldEndpoints = JSON.parse(fs.readFileSync('endpoints.json'));
  } catch (error) {
    oldEndpoints = {};
  }

  // Detecta los cambios en los endpoints
  let changes = diff(oldEndpoints, newEndpoints);

  if (changes) {
    console.log('Se han detectado los siguientes cambios:', changes);

    // Aquí es donde se utiliza la función del paso 3
    let changesHtml = `<ul>${formatChangesHtml(changes)}</ul>`;
    await sendEmail(changesHtml);

    // Guarda los nuevos endpoints
    fs.writeFileSync('endpoints.json', JSON.stringify(newEndpoints, null, 2));
  } else {
    console.log('No se han detectado cambios.');
  }
 */