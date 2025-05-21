import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import authController from '../../controllers/authController';
import authService from '../../services/authService';
import { validationResult } from 'express-validator';

// Mock do authService e express-validator
jest.mock('../../services/authService');
jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));

describe('AuthController', () => {
  // Configuração do ambiente de teste
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de response
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockResponse = {
      status: responseStatus,
      json: responseJson
    };
    
    // Mock de validationResult
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      // Dados de teste
      const userData = {
        name: 'Teste',
        email: 'teste@example.com',
        password: 'senha123'
      };
      
      mockRequest = {
        body: userData
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
      await authController.register(mockRequest as Request, mockResponse as Response);
      
      // Verificações
      expect(authService.register).toHaveBeenCalledWith(userData);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Usuário registrado com sucesso',
        user: mockUser
      });
    });
    
    it('deve retornar erro 400 se a validação falhar', async () => {
      // Dados de teste
      mockRequest = {
        body: {}
      };
      
      const validationErrors = [{ msg: 'Nome é obrigatório' }];
      
      // Configuração dos mocks
      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      });
      
      // Execução do teste
      await authController.register(mockRequest as Request, mockResponse as Response);
      
      // Verificações
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ errors: validationErrors });
      expect(authService.register).not.toHaveBeenCalled();
    });
    
    it('deve retornar erro 409 se o email já estiver cadastrado', async () => {
      // Dados de teste
      const userData = {
        name: 'Teste',
        email: 'existente@example.com',
        password: 'senha123'
      };
      
      mockRequest = {
        body: userData
      };
      
      // Configuração dos mocks
      (authService.register as jest.Mock).mockRejectedValue(new Error('Email já cadastrado'));
      
      // Execução do teste
      await authController.register(mockRequest as Request, mockResponse as Response);
      
      // Verificações
      expect(authService.register).toHaveBeenCalledWith(userData);
      expect(responseStatus).toHaveBeenCalledWith(409);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Email já cadastrado' });
    });
    
    it('deve retornar erro 500 para outros erros', async () => {
      // Dados de teste
      const userData = {
        name: 'Teste',
        email: 'teste@example.com',
        password: 'senha123'
      };
      
      mockRequest = {
        body: userData
      };
      
      // Configuração dos mocks
      (authService.register as jest.Mock).mockRejectedValue(new Error('Erro interno'));
      
      // Execução do teste
      await authController.register(mockRequest as Request, mockResponse as Response);
      
      // Verificações
      expect(authService.register).toHaveBeenCalledWith(userData);
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Erro ao registrar usuário' });
    });
  });
  
  describe('login', () => {
    it('deve realizar login com sucesso', async () => {
      // Dados de teste
      const loginData = {
        email: 'teste@example.com',
        password: 'senha123'
      };
      
      mockRequest = {
        body: loginData
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
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Verificações
      expect(authService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Login realizado com sucesso',
        ...authResult
      });
    });
    
    it('deve retornar erro 400 se a validação falhar', async () => {
      // Dados de teste
      mockRequest = {
        body: {}
      };
      
      const validationErrors = [{ msg: 'Email inválido' }];
      
      // Configuração dos mocks
      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      });
      
      // Execução do teste
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Verificações
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ errors: validationErrors });
      expect(authService.login).not.toHaveBeenCalled();
    });
    
    it('deve retornar erro 401 se as credenciais forem inválidas', async () => {
      // Dados de teste
      const loginData = {
        email: 'teste@example.com',
        password: 'senha_errada'
      };
      
      mockRequest = {
        body: loginData
      };
      
      // Configuração dos mocks
      (authService.login as jest.Mock).mockRejectedValue(new Error('Credenciais inválidas'));
      
      // Execução do teste
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Verificações
      expect(authService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Credenciais inválidas' });
    });
    
    it('deve retornar erro 500 para outros erros', async () => {
      // Dados de teste
      const loginData = {
        email: 'teste@example.com',
        password: 'senha123'
      };
      
      mockRequest = {
        body: loginData
      };
      
      // Configuração dos mocks
      (authService.login as jest.Mock).mockRejectedValue(new Error('Erro interno'));
      
      // Execução do teste
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Verificações
      expect(authService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Erro ao realizar login' });
    });
  });
});
