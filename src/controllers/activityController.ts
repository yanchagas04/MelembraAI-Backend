import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { activityService } from '../services/activityService';

class ActivityController {
  // Criar atividade
  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const userId = req.user?.userId;
      const activityData = {
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        completed: req.body.completed || false
      };

      const newActivity = await activityService.createActivity(activityData, userId as unknown as string);
      res.status(201).json({
        message: 'Atividade criada com sucesso',
        activity: newActivity
      });
    } catch (error) {
      console.error('Erro no controller (create):', error);
      res.status(500).json({ message: 'Erro ao criar atividade' });
    }
  }

  // Listar todas as atividades
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const activities = await activityService.getAllActivities(userId as unknown as string);
      res.status(200).json({ activities });
    } catch (error) {
      console.error('Erro no controller (getAll):', error);
      res.status(500).json({ message: 'Erro ao buscar atividades' });
    }
  }

  // Buscar atividade específica
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const activityId = req.params.id;
      
      const activity = await activityService.getActivityById(activityId, userId as unknown as string);
      
      if (!activity) {
        res.status(404).json({ message: 'Atividade não encontrada' });
        return;
      }

      res.status(200).json({ activity });
    } catch (error) {
      console.error('Erro no controller (getById):', error);
      res.status(500).json({ message: 'Erro ao buscar atividade' });
    }
  }

  // Atualizar atividade
  async update(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const userId = req.user?.userId;
      const activityId = req.params.id;
      const activityData = {
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        completed: req.body.completed
      };

      const updatedActivity = await activityService.updateActivity(
        activityId, 
        activityData, 
        userId as unknown as string
      );

      res.status(200).json({
        message: 'Atividade atualizada com sucesso',
        activity: updatedActivity
      });
    } catch (error) {
      console.error('Erro no controller (update):', error);
      res.status(500).json({ message: 'Erro ao atualizar atividade' });
    }
  }

  // Deletar atividade
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const activityId = req.params.id;

      await activityService.deleteActivity(activityId, userId as unknown as string);
      res.status(200).json({ message: 'Atividade deletada com sucesso' });
    } catch (error) {
      console.error('Erro no controller (delete):', error);
      res.status(500).json({ message: 'Erro ao deletar atividade' });
    }
  }
}

export default new ActivityController();