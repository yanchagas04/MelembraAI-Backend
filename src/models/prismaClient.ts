import { PrismaClient } from '../../lib/prisma/client';

// Definindo os tipos User e Activity para resolver problemas de importação
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Activity = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

const prisma = new PrismaClient();

export default prisma;
