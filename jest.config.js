// Requiere el módulo directamente en lugar de importarlo
const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
}



// Exporta la configuración usando module.exports en lugar de export default
module.exports = createJestConfig(config);
