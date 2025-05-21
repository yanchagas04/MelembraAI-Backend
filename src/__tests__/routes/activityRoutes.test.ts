import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../server';
import activityService from '../../services/activityService';
import authService from '../../services/authService';

// Mock dos serviços
jest.mock('../../services/activityService');
jest.mock('../../services/authService');

describe('Activity Routes', () => {
  // Token de autenticação para testes
  const mockToken = 'valid_token';
  const mockUserId = 1;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock da verificação do token
    (authService.verifyToken as jest.Mock).mockReturnValue({
      userId: mockUserId,
      email: 'teste@example.com'
    });
  });

  describe('POST /api/activities', () => {
    it('deve criar uma nova atividade com sucesso', async () => {
      // Dados de teste
      const activityData = {
        title: 'Teste de Atividade',
        description: 'Descrição de teste',
        date: '2025-06-01',
        completed: false
      };
      
      const mockActivity = {
        id: 1,
        title: activityData.title,
        description: activityData.description,
        date: new Date(activityData.date),
        completed: activityData.completed,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Configuração dos mocks
      (activityService.createActivity as jest.Mock).mockResolvedValue(mockActivity);
      
      // Execução do teste
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(activityData);
      
      // Verificações
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Atividade criada com sucesso');
      expect(response.body).toHaveProperty('activity');
      expect(activityService.createActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          title: activityData.title,
          description: activityData.description,
          date: expect.any(Date),
          completed: activityData.completed
        }),
        mockUserId
      );
    });
    
    it('deve retornar erro 401 se não houver token de autenticação', async () => {
      // Dados de teste
      const activityData = {
        title: 'Teste de Atividade',
        description: 'Descrição de teste',
        date: '2025-06-01',
        completed: false
      };
      
      // Execução do teste
      const response = await request(app)
        .post('/api/activities')
        .send(activityData);
      
      // Verificações
      expect(response.status).toBe(401);
      expect(activityService.createActivity).not.toHaveBeenCalled();
    });
    
    it('deve retornar erro 400 se os dados forem inválidos', async () => {
      // Dados de teste incompletos
      const activityData = {
        description: 'Descrição de teste',
        completed: false
        // title e date estão faltando
      };
      
      // Execução do teste
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(activityData);
      
      // Verificações
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(activityService.createActivity).not.toHaveBeenCalled();
    });
  });
  
  describe('GET /api/activities', () => {
    it('deve retornar todas as atividades do usuário', async () => {
      // Dados de teste
      const mockActivities = [
        {
          id: 1,
          title: 'Atividade 1',
          description: 'Descrição 1',
          date: new Date('2025-06-01'),
          completed: false,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          title: 'Atividade 2',
          description: 'Descrição 2',
          date: new Date('2025-06-02'),
          completed: true,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Configuração dos mocks
      (activityService.getAllActivities as jest.Mock).mockResolvedValue(mockActivities);
      
      // Execução do teste
      const response = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${mockToken}`);
      
      // Verificações
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('activities');
      expect(response.body.activities).toHaveLength(2);
      expect(activityService.getAllActivities).toHaveBeenCalledWith(mockUserId);
    });
    
    it('deve retornar erro 401 se não houver token de autenticação', async () => {
      // Execução do teste
      const response = await request(app)
        .get('/api/activities');
      
      // Verificações
      expect(response.status).toBe(401);
      expect(activityService.getAllActivities).not.toHaveBeenCalled();
    });
  });
  
  describe('GET /api/activities/:id', () => {
    it('deve retornar uma atividade específica', async () => {
      // Dados de teste
      const activityId = 1;
      const mockActivity = {
        id: activityId,
        title: 'Atividade Teste',
        description: 'Descrição teste',
        date: new Date('2025-06-01'),
        completed: false,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Configuração dos mocks
      (activityService.getActivityById as jest.Mock).mockResolvedValue(mockActivity);
      
      // Execução do teste
      const response = await request(app)
        .get(`/api/activities/${activityId}`)
        .set('Authorization', `Bearer ${mockToken}`);
      
      // Verificações
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('activity');
      expect(response.body.activity.id).toBe(activityId);
      expect(activityService.getActivityById).toHaveBeenCalledWith(activityId, mockUserId);
    });
    
    it('deve retornar erro 401 se não houver token de autenticação', async () => {
      // Execução do teste
      const response = await request(app)
        .get('/api/activities/1');
      
      // Verificações
      expect(response.status).toBe(401);
      expect(activityService.getActivityById).not.toHaveBeenCalled();
    });
    
    it('deve retornar erro 404 se a atividade não for encontrada', async () => {
      // Dados de teste
      const activityId = 999;
      
      // Configuração dos mocks
      (activityService.getActivityById as jest.Mock).mockRejectedValue(new Error('Atividade não encontrada'));
      
      // Execução do teste
      const response = await request(app)
        .get(`/api/activities/${activityId}`)
        .set('Authorization', `Bearer ${mockToken}`);
      
      // Verificações
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Atividade não encontrada');
      expect(activityService.getActivityById).toHaveBeenCalledWith(activityId, mockUserId);
    });
  });
});
