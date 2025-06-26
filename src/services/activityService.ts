import prisma, { Activity } from '../models/prismaClient';

interface ActivityData {
  title: string;
  description?: string;
  date: Date;
  completed?: boolean;
}

class ActivityService {
  // Criar atividade
  async createActivity(activityData: ActivityData, userId: string): Promise<Activity> {
    try {
      return await prisma.activity.create({
        data: {
          title: activityData.title,
          description: activityData.description || '',
          date: activityData.date,
          completed: activityData.completed || false,
          userId: userId
        }
      });
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      throw new Error('Falha ao criar atividade');
    }
  }

  // Buscar todas as atividades do usuário
  async getAllActivities(userId: string): Promise<Activity[]> {
    try {
      return await prisma.activity.findMany({
        where: { userId },
        orderBy: { date: 'asc' }
      });
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      throw new Error('Falha ao buscar atividades');
    }
  }

  // Buscar atividade por ID
  async getActivityById(id: string, userId: string): Promise<Activity | null> {
    try {
      return await prisma.activity.findFirst({
        where: { id, userId }
      });
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
      throw new Error('Falha ao buscar atividade');
      console.error('Erro no serviço de busca de atividade por ID: ', error);
      throw error;
    }
  }

  // Atualizar atividade
  async updateActivity(
    id: string, 
    activityData: ActivityData, 
    userId: string
  ): Promise<Activity> {
    try {
      return await prisma.activity.update({
        where: { id },
        data: {
          title: activityData.title,
          description: activityData.description,
          date: activityData.date,
          completed: activityData.completed,
          userId: userId
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      throw new Error('Falha ao atualizar atividade');
      console.error('Erro no serviço de atualização de atividade: ', error);
      throw error;
    }
  }

  // Deletar atividade
  async deleteActivity(id: string, userId: string): Promise<void> {
    try {
      await prisma.activity.deleteMany({
        where: { id, userId }
      });
    } catch (error) {
      console.error('Erro ao deletar atividade:', error);
      throw new Error('Falha ao deletar atividade');
      console.error('Erro no serviço de exclusão de atividade: ', error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();