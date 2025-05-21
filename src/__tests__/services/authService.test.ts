import { jest } from '@jest/globals';
import authService from '../../services/authService';
import { prisma } from '../prisma-mock';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// Mock de bcrypt e jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  // Configuração do ambiente de teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      // Dados de teste
      const userData = {
        name: 'Teste',
        email: 'teste@example.com',
        password: 'senha123'
      };

      const hashedPassword = 'hashed_password';
      const mockUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Configuração dos mocks
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      // Execução do teste
      const result = await authService.register(userData);

      // Verificações
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword
        }
      });
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt
      });
    });

    it('deve lançar erro se o email já estiver cadastrado', async () => {
      // Dados de teste
      const userData = {
        name: 'Teste',
        email: 'existente@example.com',
        password: 'senha123'
      };

      const existingUser = {
        id: 1,
        name: 'Usuário Existente',
        email: userData.email,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Configuração dos mocks
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

      // Execução do teste e verificação
      await expect(authService.register(userData)).rejects.toThrow('Email já cadastrado');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
    });
  });

  describe('login', () => {
    it('deve realizar login com sucesso', async () => {
      // Dados de teste
      const email = 'teste@example.com';
      const password = 'senha123';
      const mockUser = {
        id: 1,
        name: 'Teste',
        email,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockToken = 'jwt_token';

      // Configuração dos mocks
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      // Execução do teste
      const result = await authService.login(email, password);

      // Verificações
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email
        },
        token: mockToken
      });
    });

    it('deve lançar erro se o usuário não existir', async () => {
      // Dados de teste
      const email = 'inexistente@example.com';
      const password = 'senha123';

      // Configuração dos mocks
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Execução do teste e verificação
      await expect(authService.login(email, password)).rejects.toThrow('Credenciais inválidas');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email }
      });
    });

    it('deve lançar erro se a senha for inválida', async () => {
      // Dados de teste
      const email = 'teste@example.com';
      const password = 'senha_errada';
      const mockUser = {
        id: 1,
        name: 'Teste',
        email,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Configuração dos mocks
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Execução do teste e verificação
      await expect(authService.login(email, password)).rejects.toThrow('Credenciais inválidas');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });
  });

  describe('verifyToken', () => {
    it('deve verificar um token válido', () => {
      // Dados de teste
      const token = 'valid_token';
      const decodedToken = {
        userId: 1,
        email: 'teste@example.com',
        iat: 1234567890,
        exp: 9876543210
      };

      // Configuração dos mocks
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      // Execução do teste
      const result = authService.verifyToken(token);

      // Verificações
      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
      expect(result).toEqual(decodedToken);
    });

    it('deve lançar erro se o token for inválido', () => {
      // Dados de teste
      const token = 'invalid_token';

      // Configuração dos mocks
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token inválido');
      });

      // Execução do teste e verificação
      expect(() => authService.verifyToken(token)).toThrow('Token inválido');
      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
    });
  });
});
