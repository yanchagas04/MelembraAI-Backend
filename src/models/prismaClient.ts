import { PrismaClient } from '../../lib/prisma/client';

// Definindo os tipos User e Activity para resolver problemas de importação
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Activity = {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  completed: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

const prisma = new PrismaClient();

export default prisma;
