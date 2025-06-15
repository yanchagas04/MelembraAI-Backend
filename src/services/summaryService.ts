import prisma from '../models/prismaClient';
import { sendEmail } from '../config/email';
import { User, Activity } from '../models/prismaClient';

class SummaryService {
  async sendManualSummary(userId: string): Promise<void> {
    try {
      // Buscar usuário e atividades
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const activities = await prisma.activity.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
      });

      // Gerar resumo
      const summary = this.generateSummary(activities, user);

      // Enviar email
      await sendEmail({
        to: user.email,
        subject: 'Seu Resumo de Atividades - MelembraAI',
        html: summary,
      });
    } catch (error) {
      console.error('Error in summary service:', error);
      throw error;
    }
  }

  private generateSummary(activities: Activity[], user: User): string {
    const completed = activities.filter(a => a.completed);
    const pending = activities.filter(a => !a.completed);

    return `
      <h1>Olá, ${user.name}!</h1>
      <p>Aqui está o resumo das suas atividades:</p>
      
      <h2>Atividades Concluídas (${completed.length})</h2>
      <ul>
        ${completed.map(a => `<li>${a.title} - ${a.date.toLocaleDateString()}</li>`).join('')}
      </ul>
      
      <h2>Atividades Pendentes (${pending.length})</h2>
      <ul>
        ${pending.map(a => `<li>${a.title} - ${a.date.toLocaleDateString()}</li>`).join('')}
      </ul>
      
      <p>Atenciosamente,<br>Equipe MelembraAI</p>
    `;
  }
}

export default new SummaryService();