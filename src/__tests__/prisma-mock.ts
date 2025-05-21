import { jest } from '@jest/globals';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import prisma from '../models/prismaClient';

// Mock do PrismaClient
jest.mock('../models/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prisma);
});

export { prisma };
