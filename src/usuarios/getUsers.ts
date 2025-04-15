import { Request, Response } from "express";
import { prisma } from "../server";

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." , details: error });
    }
};