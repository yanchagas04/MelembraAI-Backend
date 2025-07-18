import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Interface para o token decodificado
interface DecodedToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

// Interface para estender o Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

const TOKEN_NAO_FORNECIDO = 'Token de autenticação não fornecido';
const TOKEN_INVALIDO = 'Token inválido ou expirado';
const ERRO_INTERNO = 'Erro do servidor, contate o administrador.';

// Middleware para verificar autenticação
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Verificar se o token está presente no header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: TOKEN_NAO_FORNECIDO });
      return;
    }
    
    // Extrair o token
    const token = authHeader.split(' ')[1];
    
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as DecodedToken;
    
    // Adicionar o usuário decodificado à requisição
    req.user = decoded;
    
    // Prosseguir para o próximo middleware ou controller
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação: ', error);
    
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: TOKEN_INVALIDO });
      return;
    }
    
    res.status(500).json({ message: ERRO_INTERNO });
  }
};

export default authMiddleware;
