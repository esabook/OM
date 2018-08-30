var fs = require('fs');
var storage = require('azure-storage');

    
function readConfig() {

    var config = JSON.parse(fs.readFileSync('./app.config', 'utf8'));
    if (config.useDevelopmentStorage) {
        config.connectionString = storage.generateDevelopmentStorageCredentials();
    }
    return config;
}

module.exports = readConfig();