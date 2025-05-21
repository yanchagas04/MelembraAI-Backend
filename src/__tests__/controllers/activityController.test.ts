import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import activityController from '../../controllers/activityController';
import activityService from '../../services/activityService';
import { validationResult } from 'express-validator';

// Mock do activityService e express-validator
jest.mock('../../services/activityService');
jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));

describe('ActivityController', () => {
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

  describe('getById', () => {
    it('deve retornar erro 500 para erros internos', async () => {
      // Dados de teste
      const userId = 1;
      const activityId = 1;
      mockRequest = {
        user: { userId },
        params: { id: activityId.toString() }
      };
      
      // Configuração dos mocks - corrigindo o tipo do erro
      (activityService.getActivityById as jest.Mock).mockRejectedValue(new Error('Erro interno') as Error);
      
      // Execução do teste
      await activityController.getById(mockRequest as Request, mockResponse as Response);
      
      // Verificações
      expect(activityService.getActivityById).toHaveBeenCalledWith(activityId, userId);
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ message: 'Erro ao buscar atividade' });
    });
  });
});
