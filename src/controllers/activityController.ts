import { Request, Response } from 'express';
const {validationResult} = require('express-validator');
import activityService from '../services/activityService';

const ERRO_INTERNO = 'Erro do servidor, contate o administrador.';
const ATIVIDADE_NAO_ENCONTRADA = 'Atividade nao encontrada.';

class ActivityController {
  // Criar uma nova atividade
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      
      const userId = req.user?.userId as unknown as string;
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
      console.log('Erro no controller de criação de atividade: ', error);
      res.status(500).json({ message: ERRO_INTERNO});
    }
  }
  
  // Buscar todas as atividades do usuário
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId as unknown as string;
      
      const activities = await activityService.getAllActivities(userId);
      
      res.status(200).json({
        activities
      });
    } catch (error) {
      console.error('Erro no controller de busca de atividades:', error);
      res.status(500).json({ message: ERRO_INTERNO });
    }
  }
  
  // Buscar uma atividade por ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId as unknown as string;
      const activityId = (req.params.id);
      
      const activity = await activityService.getActivityById(activityId, userId);
      
      res.status(200).json({
        activity
      });
    } catch (error: any) {
      console.error('Erro no controller de busca de atividade por ID:', error);
      
      if (error.message === ATIVIDADE_NAO_ENCONTRADA) {
        res.status(404).json({ message: ATIVIDADE_NAO_ENCONTRADA });
        return;
      }
      
      res.status(500).json({ message: ERRO_INTERNO });
    }
  }
  
  // Atualizar uma atividade
  async update(req: Request, res: Response): Promise<void> {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      
      const userId = req.user?.userId as unknown as string;
      const activityId = (req.params.id);
      const activityData = {
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        completed: req.body.completed
      };
      
      const updatedActivity = await activityService.updateActivity(activityId, activityData, userId);
      
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
  
  // Excluir uma atividade
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId as unknown as string;
      const activityId = (req.params.id);
      
      await activityService.deleteActivity(activityId, userId);
      
      res.status(200).json({
        message: 'Atividade excluída com sucesso'
      });
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
