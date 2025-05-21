import { jest } from '@jest/globals';
import activityService from '../../services/activityService';
import { prisma } from '../prisma-mock';

describe('ActivityService', () => {
  // Configuração do ambiente de teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createActivity', () => {
    it('deve criar uma nova atividade com sucesso', async () => {
      // Dados de teste
      const userId = 1;
      const activityData = {
        title: 'Teste de Atividade',
        description: 'Descrição de teste',
        date: new Date('2025-06-01'),
        completed: false
      };

      const mockActivity = {
        id: 1,
        title: activityData.title,
        description: activityData.description,
        date: activityData.date,
        completed: activityData.completed,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Configuração dos mocks
      (prisma.activity.create as jest.Mock).mockResolvedValue(mockActivity);

      // Execução do teste
      const result = await activityService.createActivity(activityData, userId);

      // Verificações
      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: {
          title: activityData.title,
          description: activityData.description,
          date: activityData.date,
          completed: activityData.completed,
          userId: userId
        }
      });
      expect(result).toEqual(mockActivity);
    });

    it('deve criar uma atividade com valores padrão quando opcionais não são fornecidos', async () => {
      // Dados de teste
      const userId = 1;
      const activityData = {
        title: 'Teste de Atividade',
        date: new Date('2025-06-01')
      };

      const mockActivity = {
        id: 1,
        title: activityData.title,
        description: '',
        date: activityData.date,
        completed: false,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Configuração dos mocks
      (prisma.activity.create as jest.Mock).mockResolvedValue(mockActivity);

      // Execução do teste
      const result = await activityService.createActivity(activityData, userId);

      // Verificações
      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: {
          title: activityData.title,
          description: '',
          date: activityData.date,
          completed: false,
          userId: userId
        }
      });
      expect(result).toEqual(mockActivity);
    });
  });

  describe('getAllActivities', () => {
    it('deve retornar todas as atividades de um usuário', async () => {
      // Dados de teste
      const userId = 1;
      const mockActivities = [
        {
          id: 1,
          title: 'Atividade 1',
          description: 'Descrição 1',
          date: new Date('2025-06-01'),
          completed: false,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          title: 'Atividade 2',
          description: 'Descrição 2',
          date: new Date('2025-06-02'),
          completed: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Configuração dos mocks
      (prisma.activity.findMany as jest.Mock).mockResolvedValue(mockActivities);

      // Execução do teste
      const result = await activityService.getAllActivities(userId);

      // Verificações
      expect(prisma.activity.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { date: 'asc' }
      });
      expect(result).toEqual(mockActivities);
    });

    it('deve retornar um array vazio se o usuário não tiver atividades', async () => {
      // Dados de teste
      const userId = 1;

      // Configuração dos mocks
      (prisma.activity.findMany as jest.Mock).mockResolvedValue([]);

      // Execução do teste
      const result = await activityService.getAllActivities(userId);

      // Verificações
      expect(prisma.activity.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { date: 'asc' }
      });
      expect(result).toEqual([]);
    });
  });

  describe('getActivityById', () => {
    it('deve retornar uma atividade específica', async () => {
      // Dados de teste
      const userId = 1;
      const activityId = 1;
      const mockActivity = {
        id: activityId,
        title: 'Atividade Teste',
        description: 'Descrição teste',
        date: new Date('2025-06-01'),
        completed: false,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Configuração dos mocks
      (prisma.activity.findFirst as jest.Mock).mockResolvedValue(mockActivity);

      // Execução do teste
      const result = await activityService.getActivityById(activityId, userId);

      // Verificações
      expect(prisma.activity.findFirst).toHaveBeenCalledWith({
        where: { 
          id: activityId,
          userId
        }
      });
      expect(result).toEqual(mockActivity);
    });

    it('deve lançar erro se a atividade não for encontrada', async () => {
      // Dados de teste
      const userId = 1;
      const activityId = 999;

      // Configuração dos mocks
      (prisma.activity.findFirst as jest.Mock).mockResolvedValue(null);

      // Execução do teste e verificação
      await expect(activityService.getActivityById(activityId, userId)).rejects.toThrow('Atividade não encontrada');
      expect(prisma.activity.findFirst).toHaveBeenCalledWith({
        where: { 
          id: activityId,
          userId
        }
      });
    });
  });

  describe('updateActivity', () => {
    it('deve atualizar uma atividade com sucesso', async () => {
      // Dados de teste
      const userId = 1;
      const activityId = 1;
      const activityData = {
        title: 'Atividade Atualizada',
        description: 'Descrição atualizada',
        date: new Date('2025-06-15'),
        completed: true
      };

      const existingActivity = {
        id: activityId,
        title: 'Atividade Original',
        description: 'Descrição original',
        date: new Date('2025-06-01'),
        completed: false,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedActivity = {
        ...existingActivity,
        title: activityData.title,
        description: activityData.description,
        date: activityData.date,
        completed: activityData.completed,
        updatedAt: new Date()
      };

      // Configuração dos mocks
      (prisma.activity.findFirst as jest.Mock).mockResolvedValue(existingActivity);
      (prisma.activity.update as jest.Mock).mockResolvedValue(updatedActivity);

      // Execução do teste
      const result = await activityService.updateActivity(activityId, activityData, userId);

      // Verificações
      expect(prisma.activity.findFirst).toHaveBeenCalledWith({
        where: { 
          id: activityId,
          userId
        }
      });
      expect(prisma.activity.update).toHaveBeenCalledWith({
        where: { id: activityId },
        data: {
          title: activityData.title,
          description: activityData.description,
          date: activityData.date,
          completed: activityData.completed
        }
      });
      expect(result).toEqual(updatedActivity);
    });

    it('deve lançar erro se a atividade não for encontrada', async () => {
      // Dados de teste
      const userId = 1;
      const activityId = 999;
      const activityData = {
        title: 'Atividade Atualizada',
        description: 'Descrição atualizada',
        date: new Date('2025-06-15'),
        completed: true
      };

      // Configuração dos mocks
      (prisma.activity.findFirst as jest.Mock).mockResolvedValue(null);

      // Execução do teste e verificação
      await expect(activityService.updateActivity(activityId, activityData, userId)).rejects.toThrow('Atividade não encontrada');
      expect(prisma.activity.findFirst).toHaveBeenCalledWith({
        where: { 
          id: activityId,
          userId
        }
      });
    });
  });

  describe('deleteActivity', () => {
    it('deve excluir uma atividade com sucesso', async () => {
      // Dados de teste
      const userId = 1;
      const activityId = 1;
      const existingActivity = {
        id: activityId,
        title: 'Atividade para Excluir',
        description: 'Descrição',
        date: new Date('2025-06-01'),
        completed: false,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Configuração dos mocks
      (prisma.activity.findFirst as jest.Mock).mockResolvedValue(existingActivity);
      (prisma.activity.delete as jest.Mock).mockResolvedValue(existingActivity);

      // Execução do teste
      const result = await activityService.deleteActivity(activityId, userId);

      // Verificações
      expect(prisma.activity.findFirst).toHaveBeenCalledWith({
        where: { 
          id: activityId,
          userId
        }
      });
      expect(prisma.activity.delete).toHaveBeenCalledWith({
        where: { id: activityId }
      });
      expect(result).toEqual(existingActivity);
    });

    it('deve lançar erro se a atividade não for encontrada', async () => {
      // Dados de teste
      const userId = 1;
      const activityId = 999;

      // Configuração dos mocks
      (prisma.activity.findFirst as jest.Mock).mockResolvedValue(null);

      // Execução do teste e verificação
      await expect(activityService.deleteActivity(activityId, userId)).rejects.toThrow('Atividade não encontrada');
      expect(prisma.activity.findFirst).toHaveBeenCalledWith({
        where: { 
          id: activityId,
          userId
        }
      });
    });
  });
});
