import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { activityService } from '../services/activityService';

const ERRO_INTERNO = 'Erro do servidor, contate o administrador.';
const ATIVIDADE_NAO_ENCONTRADA = 'Atividade nao encontrada.';

class ActivityController {
  // Criar atividade
  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const userId = req.user?.userId as string;
      const activityData = {
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        completed: req.body.completed || false
      };

      const newActivity = await activityService.createActivity(activityData, userId);
      res.status(201).json({
        message: 'Atividade criada com sucesso',
        activity: newActivity
      });
    } catch (error) {
      console.error('Erro no controller (create):', error);
      res.status(500).json({ message: 'Erro ao criar atividade' });
      console.log('Erro no controller de criação de atividade: ', error);
      res.status(500).json({ message: ERRO_INTERNO});
    }
  }

  // Listar todas as atividades
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const activities = await activityService.getAllActivities(userId);
      res.status(200).json({ activities });
    } catch (error) {
      console.error('Erro no controller (getAll):', error);
      res.status(500).json({ message: 'Erro ao buscar atividades' });
      console.error('Erro no controller de busca de atividades:', error);
      res.status(500).json({ message: ERRO_INTERNO });
    }
  }

  // Buscar atividade específica
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId as unknown as string;
      const activityId = req.params.id;
      
      const activity = await activityService.getActivityById(activityId, userId);
      
      if (!activity) {
        res.status(404).json({ message: 'Atividade não encontrada' });
        return;
      }

      res.status(200).json({ activity });
    } catch (error: any) {
      console.error('Erro no controller de busca de atividade por ID:', error);
      
      if (error.message === ATIVIDADE_NAO_ENCONTRADA) {
        res.status(404).json({ message: ATIVIDADE_NAO_ENCONTRADA });
        return;
      }
      
      res.status(500).json({ message: ERRO_INTERNO });
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

      const userId = req.user?.userId as unknown as string;
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
        userId
      );

      res.status(200).json({
        message: 'Atividade atualizada com sucesso',
        activity: updatedActivity
      });
    } catch (error: any) {
      console.error('Erro no controller de atualização de atividade:', error);
      
      if (error.message === ATIVIDADE_NAO_ENCONTRADA) {
        res.status(404).json({ message: ATIVIDADE_NAO_ENCONTRADA });
        return;
      }
      
      res.status(500).json({ message: ERRO_INTERNO });
    }
  }

  // Deletar atividade
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId as unknown as string;
      const activityId = req.params.id;

      await activityService.deleteActivity(activityId, userId);
      res.status(200).json({ message: 'Atividade deletada com sucesso' });
    } catch (error: any) {
      console.error('Erro no controller de exclusão de atividade:', error);
      
      if (error.message === ATIVIDADE_NAO_ENCONTRADA) {
        res.status(404).json({ message: ATIVIDADE_NAO_ENCONTRADA });
        return;
      }
      
      res.status(500).json({ message: ERRO_INTERNO });
    }
  }
}

export default new ActivityController();