import { Request, Response } from 'express';
const {validationResult} = require('express-validator');
import authService from '../services/authService';

const ERRO_INTERNO = 'Erro do servidor, contate o administrador';
const EMAIL_JA_CADASTRADO = 'Email ja cadastrado';
const CREDENCIAIS_INVALIDAS = 'Credenciais inválidas';

class AuthController {
  // Registrar um novo usuário
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      
      const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };
      
      const newUser = await authService.register(userData);
      
      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        user: newUser
      });
    } catch (error: any) {
      console.error('Erro no controller de registro: ', error);
      
      if (error.message === EMAIL_JA_CADASTRADO) {
        res.status(409).json({ message: EMAIL_JA_CADASTRADO });
        return;
      }
      
      res.status(500).json({ message: ERRO_INTERNO });
    }
  }
  
  // Login de usuário
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      
      const { email, password } = req.body;
      
      const authData = await authService.login(email, password);
      
      res.status(200).json({
        message: 'Login realizado com sucesso',
        ...authData
      });
    } catch (error: any) {
      console.error('Erro no controller de login: ', error);
      
      if (error.message === CREDENCIAIS_INVALIDAS) {
        res.status(401).json({ message: CREDENCIAIS_INVALIDAS });
        return;
      }
      
      res.status(500).json({ message: ERRO_INTERNO });
    }
  }
}

export default new AuthController();
