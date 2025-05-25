import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { swaggerUi, swaggerSpec } from './config/swagger';
import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o app Express
const app = express();

// Middlewares
app.use(cors(
  {
    origin: ['*', 'https://melembra-ai.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);

// // Rota de status
// app.get('/status', (req, res) => {
//   res.status(200).json({ status: 'online', message: 'API MelembraAI está funcionando!' });
// });

// // Tratamento de erros 404
// app.use((req, res) => {
//   res.status(404).json({ message: 'Rota não encontrada' });
// });

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Servidor de desenvolvimento rodando na porta 3001');
  } else {
    console.log(`Servidor rodando na porta ${PORT}`);
  }
});

export default app;
