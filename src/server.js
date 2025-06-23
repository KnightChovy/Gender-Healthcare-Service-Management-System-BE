import express from 'express';
import cors from 'cors';
import { CONNECT_DB } from './config/mysql';
import { env } from './config/environment.js';
import { API_V1 } from '~/routes/v1/index';
import { API_V2 } from '~/routes/v2/index';
import { authController } from '~/controllers/authController';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { connectRedis } from './config/redis';
import { initAllModels } from '~/models/initModels';

const app = express();
//const PORT = process.env.PORT || 3000;

const startServer = () => {
  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'http://52.4.72.106',
        'http://52.4.72.106:3000',
      ],
      credentials: true, // Use 'credentials' instead of 'withCredentials'
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    })
  );

  app.options(
    '*',
    cors({
      origin: [
        'http://localhost:5173',
        'http://52.4.72.106',
        'http://52.4.72.106:3000',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Routes
  app.get('/', (req, res) => {
    res.end(
      '<h1>Gender Healthcare Service Management System API</h1><hr><p>Visit <a href="/api-docs">API Documentation</a></p>'
    );
  });

  app.use('/v1', API_V1);
  app.use('/v2', API_V2);

  app.listen(env.PORT, env.HOST_NAME, () => {
   // console.log(`Server is running at http://52.4.72.106:${env.PORT}`);
    console.log(`Server is running at http://${env.HOST_NAME}:${env.PORT}`);
    console.log(
      `Swagger Documentation available at http://52.4.72.106:${env.PORT}/api-docs`
    );
  });
};

(async () => {
  try {
    console.log('connecting mysql...');
    await CONNECT_DB();

    // console.log('connecting redis...');
    // await connectRedis();
    // Initialize all models and set up associations
    initAllModels();
    startServer();
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    process.exit(1);
  }
})();
