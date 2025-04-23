import { Request, Response } from "express";
import { prisma } from "../server";
import { Prisma } from "../../lib/prisma";

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany();
        if (users.length === 0) {
            res.json(users).status(204);
        }
        res.json(users).status(200);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
        }
        if (error instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({ error: "Erro ao buscar usuários." , details: error});
            return;
        }
        res.status(500).json({ error: "Erro ao buscar usuários." , details: error});
    }
};