import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../server';
import authService from '../../services/authService';

// Mock do authService
jest.mock('../../services/authService');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      // Dados de teste
      const userData = {
        name: 'Teste',
        email: 'teste@example.com',
        password: 'senha123'
      };

      const mockUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Configuração dos mocks
      (authService.register as jest.Mock).mockResolvedValue(mockUser);

      // Execução do teste
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Verificações
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Usuário registrado com sucesso');
      expect(response.body).toHaveProperty('user');
      expect(authService.register).toHaveBeenCalledWith(userData);
    });

    it('deve retornar erro 400 se os dados forem inválidos', async () => {
      // Dados de teste incompletos
      const userData = {
        email: 'teste@example.com',
        password: 'senha123'
        // name está faltando
      };

      // Execução do teste
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Verificações
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('deve retornar erro 409 se o email já estiver cadastrado', async () => {
      // Dados de teste
      const userData = {
        name: 'Teste',
        email: 'existente@example.com',
        password: 'senha123'
      };

      // Configuração dos mocks
      (authService.register as jest.Mock).mockRejectedValue(new Error('Email já cadastrado'));

      // Execução do teste
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Verificações
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'Email já cadastrado');
      expect(authService.register).toHaveBeenCalledWith(userData);
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve realizar login com sucesso', async () => {
      // Dados de teste
      const loginData = {
        email: 'teste@example.com',
        password: 'senha123'
      };

      const authResult = {
        user: {
          id: 1,
          name: 'Teste',
          email: loginData.email
        },
        token: 'jwt_token'
      };

      // Configuração dos mocks
      (authService.login as jest.Mock).mockResolvedValue(authResult);

      // Execução do teste
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      // Verificações
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login realizado com sucesso');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(authService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
    });

    it('deve retornar erro 400 se os dados forem inválidos', async () => {
      // Dados de teste incompletos
      const loginData = {
        password: 'senha123'
        // email está faltando
      };

      // Execução do teste
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      // Verificações
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('deve retornar erro 401 se as credenciais forem inválidas', async () => {
      // Dados de teste
      const loginData = {
        email: 'teste@example.com',
        password: 'senha_errada'
      };

      // Configuração dos mocks
      (authService.login as jest.Mock).mockRejectedValue(new Error('Credenciais inválidas'));

      // Execução do teste
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      // Verificações
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciais inválidas');
      expect(authService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
    });
  });
});
