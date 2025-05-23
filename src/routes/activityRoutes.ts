import { Router } from 'express';
const {body} = require('express-validator');
import activityController from '../controllers/activityController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Cria uma nova atividade
 *     tags: [Atividades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da atividade
 *               description:
 *                 type: string
 *                 description: Descrição da atividade
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data da atividade (YYYY-MM-DD)
 *               completed:
 *                 type: boolean
 *                 description: Status de conclusão da atividade
 *     responses:
 *       201:
 *         description: Atividade criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('date').isISO8601().withMessage('Data inválida')
  ],
  activityController.create
);

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Retorna todas as atividades do usuário
 *     tags: [Atividades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de atividades
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/', activityController.getAll);

/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     summary: Retorna uma atividade específica
 *     tags: [Atividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade encontrada
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Atividade não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', activityController.getById);

/**
 * @swagger
 * /api/activities/{id}:
 *   put:
 *     summary: Atualiza uma atividade
 *     tags: [Atividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da atividade
 *               description:
 *                 type: string
 *                 description: Descrição da atividade
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data da atividade (YYYY-MM-DD)
 *               completed:
 *                 type: boolean
 *                 description: Status de conclusão da atividade
 *     responses:
 *       200:
 *         description: Atividade atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Atividade não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.put(
  '/:id',
  [
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('date').isISO8601().withMessage('Data inválida')
  ],
  activityController.update
);

/**
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     summary: Exclui uma atividade
 *     tags: [Atividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da atividade
 *     responses:
 *       200:
 *         description: Atividade excluída com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Atividade não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', activityController.delete);

export default router;
