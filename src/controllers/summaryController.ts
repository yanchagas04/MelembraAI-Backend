/*
import { Request, Response } from 'express';
import summaryService from '../services/summaryService';

class SummaryController {
  async sendManualSummary(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId as string;
        const { includeCompleted = true, includePending = true, dateRange } = req.body;

        // Log para debug
        console.log('Opções recebidas:', {
            includeCompleted,
            includePending,
            dateRange
        });

        await summaryService.sendManualSummary(userId, {
            includeCompleted,
            includePending,
            dateRange: dateRange ? {
                start: dateRange.start ? new Date(dateRange.start) : undefined,
                end: dateRange.end ? new Date(dateRange.end) : undefined,
            } : undefined,
        });

        res.status(200).json({ message: 'Resumo enviado por email com sucesso' });
    } catch (error) {
        console.error('Erro ao enviar resumo:', error);
        res.status(500).json({ 
            message: 'Erro ao enviar resumo por email',
            error: error.message 
        });
    }
}
}

export default new SummaryController(); */

import { Request, Response } from 'express';
import summaryService from '../services/summaryService';

class SummaryController {
  async sendManualSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId as string; // Extrai do token JWT
      const { 
        includeCompleted = true, 
        includePending = true, 
        dateRange 
      } = req.body;

      await summaryService.sendManualSummary(userId, {
        includeCompleted,
        includePending,
        dateRange: dateRange ? {
          start: dateRange.start ? new Date(dateRange.start) : undefined,
          end: dateRange.end ? new Date(dateRange.end) : undefined,
        } : undefined,
      });

      res.status(200).json({ message: 'Resumo enviado por email com sucesso' });
    } catch (error) {
      console.error('Erro ao enviar resumo:', error);
      res.status(500).json({ 
        message: 'Erro ao enviar resumo por email',
        error: error.message 
      });
    }
  }
}

export default new SummaryController();