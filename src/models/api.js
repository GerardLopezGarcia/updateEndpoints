class Api {
    constructor(data) {
        this.data = data;
    }
    getEndpoints() {
        // Extrae los endpoints de this.data
        let endpoints = {};
        for (let path in this.data.paths) {
          for (let method in this.data.paths[path]) {
            let endpoint = `${method.toUpperCase()} ${path}`;
            endpoints[endpoint] = this.data.paths[path][method];
          }
        }
        return endpoints;
      }
}

module.exports = Api;