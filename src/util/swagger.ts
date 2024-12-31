import express from 'express';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import fs from 'fs';

// Create a new express app instance
const app: express.Application = express();

export const options = {
  info: {
    version: '1.0.0',
    title: 'D&D 5e API',
    license: {
      name: 'MIT',
      url: 'https://github.com/5e-bits/5e-srd-api/blob/main/LICENSE.md',
    },
    description: 'REST API for the 5e SRD',
    contact: {
      name: '5eBits',
      url: 'https://github.com/5e-bits',
    },
  },
  servers: [
    {
      url: 'https://dnd5eapi.co/api/{version}',
      description: 'Production server',
      variables: {
        version: {
          enum: ['2014', '2024'],
          default: '2014',
        },
      },
    },
    {
      url: 'http://localhost:3001/api/{version}',
      description: 'Local server',
      variables: {
        version: {
          enum: ['2014', '2024'],
          default: '2014',
        },
      },
    },
  ],
  filesPattern: './src/**/*.{ts,js}',
  baseDir: process.cwd(),
};

const listener = expressJSDocSwagger(app)(options);

listener.on('finish', swaggerObject => {
  console.log(process.cwd());
  // write the swagger to a file
  fs.writeFile('swagger/api-spec/openapi.json', JSON.stringify(swaggerObject, null, 2), (err) => {
    if (err) {
      console.error(err);
    }
  });
});







