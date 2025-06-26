import prisma from '../models/prismaClient';
import { sendEmail } from '../config/email';
import { User, Activity } from '../models/prismaClient';

class SummaryService {
  async sendManualSummary(userId: string, options?: {
    includeCompleted?: boolean;
    includePending?: boolean;
    dateRange?: {
        start?: Date;
        end?: Date;
    };
}): Promise<void> {
    try {
        console.log(`Buscando usuário ${userId}...`);
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        console.log(`Buscando atividades para ${userId}...`);
        const activities = await prisma.activity.findMany({
            where: { userId },
            orderBy: { date: 'asc' },
        });

        console.log(`Total de atividades encontradas: ${activities.length}`);
        
        // Converter strings de data para objetos Date
        const activitiesWithDates = activities.map(activity => ({
            ...activity,
            date: new Date(activity.date)
        }));

        // Aplicar filtros
        let filteredActivities = activitiesWithDates;
        
        // Filtro por status (incluir todos se não especificado)
        const showCompleted = options?.includeCompleted !== false;
        const showPending = options?.includePending !== false;
        
        filteredActivities = filteredActivities.filter(activity => {
            return (activity.completed && showCompleted) || (!activity.completed && showPending);
        });

        // Filtro por data (se especificado)
        if (options?.dateRange) {
            const start = options.dateRange.start?.getTime() || 0;
            const end = options.dateRange.end?.getTime() || Date.now();
            
            filteredActivities = filteredActivities.filter(activity => {
                const activityDate = activity.date.getTime();
                return activityDate >= start && activityDate <= end;
            });
        }

        console.log(`Atividades após filtros: ${filteredActivities.length}`);
        console.log('Atividades filtradas:', filteredActivities);
        
        // Gerar resumo
        const summary = this.generateSummary(filteredActivities, user);

        // Enviar email
        await sendEmail({
            to: user.email,
            subject: 'Seu Resumo de Atividades - MelembraAI',
            html: summary,
        });
        
        console.log('E-mail enviado com sucesso!');
    } catch (error) {
        console.error('Error in summary service:', error);
        throw error;
    }
  }

  private generateSummary(activities: Activity[], user: User): string {
      const completed = activities.filter(a => a.completed);
      const pending = activities.filter(a => !a.completed);

      // Template HTML simplificado e eficiente
      return `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background-color: #4CAF50;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 5px 5px 0 0;
              }
              .content {
                  padding: 20px;
                  background-color: #f9f9f9;
                  border-radius: 0 0 5px 5px;
              }
              .section {
                  margin-bottom: 20px;
              }
              .section-title {
                  color: #4CAF50;
                  border-bottom: 2px solid #4CAF50;
                  padding-bottom: 5px;
              }
              .activity-list {
                  list-style-type: none;
                  padding: 0;
              }
              .activity-item {
                  background-color: white;
                  margin: 5px 0;
                  padding: 10px;
                  border-radius: 3px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .completed {
                  color: #4CAF50;
              }
              .pending {
                  color: #FF9800;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>Olá, ${user.name}!</h1>
              <p>Seu resumo de atividades do MelembraAI</p>
          </div>
          
          <div class="content">
              <div class="section">
                  <h2 class="section-title">Atividades Concluídas (${completed.length})</h2>
                  <ul class="activity-list">
                      ${completed.map(a => `
                      <li class="activity-item completed">✓ ${a.title} - ${new Date(a.date).toLocaleDateString('pt-BR')}</li>
                      `).join('')}
                  </ul>
              </div>
              
              <div class="section">
                  <h2 class="section-title">Atividades Pendentes (${pending.length})</h2>
                  <ul class="activity-list">
                      ${pending.map(a => `
                      <li class="activity-item pending">● ${a.title} - ${new Date(a.date).toLocaleDateString('pt-BR')}</li>
                      `).join('')}
                  </ul>
              </div>
          </div>
          
          <div class="footer">
              <p>Atenciosamente,<br>Equipe MelembraAI</p>
          </div>
      </body>
      </html>
      `;
  }
}

export default new SummaryService();