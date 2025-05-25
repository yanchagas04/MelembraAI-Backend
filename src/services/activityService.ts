import prisma, { Activity } from '../models/prismaClient';

interface ActivityData {
  title: string;
  description?: string;
  date: Date;
  completed?: boolean;
}

class ActivityService {
  // Criar uma nova atividade
  async createActivity(activityData: ActivityData, userId: string): Promise<Activity> {
    try {
      const newActivity = await prisma.activity.create({
        data: {
          title: activityData.title,
          description: activityData.description || '',
          date: activityData.date,
          completed: activityData.completed || false,
          userId: userId
        }
      });
      
      return newActivity;
    } catch (error) {
      console.error('Erro no serviço de criação de atividade:', error);
      throw error;
    }
  }
  
  // Buscar todas as atividades de um usuário
  async getAllActivities(userId: string): Promise<Activity[]> {
    try {
      const activities = await prisma.activity.findMany({
        where: { userId },
        orderBy: { date: 'asc' }
      });
      
      return activities;
    } catch (error) {
      console.error('Erro no serviço de busca de atividades:', error);
      throw error;
    }
  }
  
  // Buscar uma atividade por ID
  async getActivityById(id: string, userId: string): Promise<Activity> {
    try {
      const activity = await prisma.activity.findFirst({
        where: { 
          id,
          userId
        }
      });
      
      if (!activity) {
        throw new Error('Atividade não encontrada');
      }
      
      return activity;
    } catch (error) {
      console.error('Erro no serviço de busca de atividade por ID:', error);
      throw error;
    }
  }
  
  // Atualizar uma atividade
  async updateActivity(id: string, activityData: ActivityData, userId: string): Promise<Activity> {
    try {
      // Verificar se a atividade existe e pertence ao usuário
      await this.getActivityById(id, userId);
      
      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: {
          title: activityData.title,
          description: activityData.description,
          date: activityData.date,
          completed: activityData.completed
        }
      });
      
      return updatedActivity;
    } catch (error) {
      console.error('Erro no serviço de atualização de atividade:', error);
      throw error;
    }
  }
  
  // Excluir uma atividade
  async deleteActivity(id: string, userId: string): Promise<Activity> {
    try {
      // Verificar se a atividade existe e pertence ao usuário
      await this.getActivityById(id, userId);
      
      const deletedActivity = await prisma.activity.delete({
        where: { id }
      });
      
      return deletedActivity;
    } catch (error) {
      console.error('Erro no serviço de exclusão de atividade:', error);
      throw error;
    }
  }
}

export default new ActivityService();
