import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MelembraAI API',
      version: '1.0.0',
      description: 'API para gerenciamento de atividades e lembretes',
      contact: {
        name: 'Equipe MelembraAI',
        email: 'contato@melembraai.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // Caminho para os arquivos com anotações JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
