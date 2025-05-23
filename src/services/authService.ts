import prisma, { User } from '../models/prismaClient';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

class AuthService {
  // Registrar um novo usuário
  async register(userData: UserData): Promise<Omit<User, 'password'>> {
    try {
      // Verificar se o email já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }
      
      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Criar o usuário
      const newUser = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword
        }
      });
      
      // Retornar usuário sem a senha
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erro no serviço de registro:', error);
      throw error;
    }
  }
  
  // Login de usuário
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Buscar usuário pelo email
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        throw new Error('Credenciais inválidas');
      }
      
      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }
      
      // Gerar token JWT
      const token = this.generateToken(user);
      
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      };
    } catch (error) {
      console.error('Erro no serviço de login:', error);
      throw error;
    }
  }
  
  // Gerar token JWT
  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email
    };
    
    // Ajustado para corrigir o erro de tipagem
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );
  }
  
  // Verificar token JWT
  verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      return decoded;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      throw new Error('Token inválido');
    }
  }
}

export default new AuthService();
