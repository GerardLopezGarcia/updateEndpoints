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
}

main();