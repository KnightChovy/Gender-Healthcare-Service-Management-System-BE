const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Login API',
      version: '1.0.0',
      description: 'API để người dùng đăng nhập hệ thống',
      contact: {
        name: 'Hoang Phuc',
        email: 'dhphuc1406@gmail.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:8017',
        description: 'Development server'
      },
      {
        url: 'http://44.204.71.234:3000',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [
    './docs/swagger.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;


